import openlibraryClient from "../client/openlibrary";
import { get, set } from "../redis";

type Book = {
    title: string;
    authors: string[];
    publish_date: string;
    isbn_10: string[];
    isbn_13: string[];
    number_of_pages: number;
    cover: string;
};

const bookDataMapper = {
    async getBookByIsbn(isbn: string): Promise<Book> {

        // Tentative de récupération depuis le cache Redis
        const bookFromCache = await get<Book>(`book:${isbn}`);

        // Si le livre est trouvé dans le cache, on le retourne directement
        if (bookFromCache) {
            return bookFromCache;
        }

        // Sinon, on récupère les données depuis OpenLibrary
        const rawBook = await openlibraryClient.getBookByIsbn(isbn);

        const book: Book = {
            title: rawBook.title,
            authors: rawBook.authors ? rawBook.authors.map((a: any) => a.name || a.key) : [],
            publish_date: rawBook.publish_date || "",
            isbn_10: rawBook.isbn_10 || [],
            isbn_13: rawBook.isbn_13 || [],
            number_of_pages: rawBook.number_of_pages || 0,
            cover: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
        };

        // Stockage du livre dans le cache Redis avec un TTL de 1 mois
        set<Book>(`book:${isbn}`, book, 2629800);

        return book;
    }
};

export default bookDataMapper;