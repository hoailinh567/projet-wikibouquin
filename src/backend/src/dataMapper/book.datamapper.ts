import openlibraryClient from "../client/openlibrary.ts";
import { get, set } from "../utils/redis.ts";
import authorDataMapper from "./author.datamapper.ts";
import workDataMapper from "./work.datamapper.ts";

type Book = {
    title: string;
    authors: string[];
    publish_date: string;
    isbn: string;
    number_of_pages: number;
    cover: string;
    description: string;
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

        let authors = ["Auteur inconnu(e)"];
        // S'il y a d'authors, on récupére le nom de l'auteur dans la derniere partie après le dernier "/"
        if (rawBook.authors) {
            authors = [];
            for (const rawAuthor of rawBook.authors) {
                const authorKey = rawAuthor.key.split("/").pop();
                // Attends le résultat de getAuthorByKey avant de continuer
                const author = await authorDataMapper.getAuthorByKey(authorKey);
                authors.push(author.name);
            }
        }

        let description = "Aucune description disponible.";
        // S'il y a une description, on la récupère:
        if (rawBook.description) {
            description = rawBook.description.value;
            // Sinon, on continue à chercher dans les works associés
        } else if (rawBook.works && rawBook.works.length > 0) {
            const workKey = rawBook.works[0].key.split("/").pop();
            // Attends le resultat de getWorkByKey avant de continuer
            const work = await workDataMapper.getWorkByKey(workKey);
            description = work.description;
        }

        if (rawBook.isbn_10 === undefined || rawBook.isbn_10.length === 0) {
            throw new Error("ISBN not found for the book.");
        }

        const book: Book = {
            title: rawBook.title,
            authors: authors,
            publish_date: rawBook.publish_date || "",
            isbn: rawBook.isbn_10[0],
            number_of_pages: rawBook.number_of_pages || 0,
            cover: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
            description: description,
        };

        // Stockage du livre dans le cache Redis avec un TTL de 1 mois
        set<Book>(`book:${isbn}`, book, 2629800);

        return book;
    }
};

export default bookDataMapper;