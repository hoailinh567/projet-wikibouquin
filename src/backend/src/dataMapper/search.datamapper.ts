import openlibraryClient from "../client/openlibrary.ts";
import { get, set } from "../utils/redis.ts";

type SearchBook = {
    title: string;
    authors: string[];
    publishYear: number | null;
    isbn: string | null;
    cover: string | null;
};

type SearchResponse = {
    numFound: number;
    offset: number;
    books: SearchBook[];
};

const searchDataMapper = {
    async search(query: string, limit: number = 20, offset: number = 0): Promise<SearchResponse> {
        const cacheKey = `search:${query}:${limit}:${offset}`;

        // Try to get from cache
        const cachedResult = await get<SearchResponse>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        // Fetch more results to compensate for filtering
        const rawResult = await openlibraryClient.search({ q: query, limit: limit, offset });

        // Transform and filter results - only keep books with valid ISBN
        const books: SearchBook[] = rawResult.docs
            .filter((doc) => doc.isbn && doc.isbn.length > 0)
            .slice(0, limit)
            .map((doc) => {
                // Find a valid ISBN (prefer ISBN-10 for OpenLibrary compatibility)
                const isbn = doc.isbn!.find((i) => i.length === 10) || doc.isbn![0];
                return {
                    title: doc.title,
                    authors: doc.author_name || ["Auteur inconnu(e)"],
                    publishYear: doc.first_publish_year || null,
                    isbn,
                    // Prefer cover_i (guaranteed to exist), fallback to ISBN-based cover
                    cover: doc.cover_i
                        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                        : `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
                };
            });

        const response: SearchResponse = {
            numFound: rawResult.numFound,
            offset: rawResult.start,
            books,
        };

        // Cache for 1 hour (search results change more frequently)
        await set<SearchResponse>(cacheKey, response, 3600);

        return response;
    }
};

export default searchDataMapper;
