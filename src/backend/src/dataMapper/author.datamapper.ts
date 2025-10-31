import openlibraryClient from "../client/openlibrary.ts";
import { get, set } from "../utils/redis.ts";

type Author = {
    name: string;
};

const authorDataMapper = {
    async getAuthorByKey(key: string): Promise<Author> {

        const authorFromCache = await get<Author>(`author:${key}`);

        if (authorFromCache) {
            return authorFromCache;
        }

        const rawAuthor = await openlibraryClient.getAuthorByKey(key);

        const author: Author = {
            name: rawAuthor.name || "Auteur inconnu"
        };

        // Stockage du livre dans le cache Redis avec un TTL de 1 mois
        set<Author>(`author:${key}`, author, 2629800);

        return author;
    }
};

export default authorDataMapper;