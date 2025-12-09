import type { Request, Response } from "express";
import collectionDataMapper from "../dataMapper/collection.datamapper.ts";
import { addOrDeleteBookRequest } from "../validation/collection.validator.ts";
import bookDataMapper from "../dataMapper/book.datamapper.ts";
import { isValidIsbn } from "../validation/book.validator.ts";

const collectionController = {
    async manageMyCollection(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            return res.status(500).json({ error: "no user" })
        }

        const collection = await collectionDataMapper.getCollectionByUserId(user.id);
        if (!collection) {
            return res.status(404).json({ error: "no collection" })
        }

        if (!collection.books) {
            return res.status(404).json({ error: "no books in collection" })
        }

        let bookCollectionWithDetails = [];

        for (const book of collection.books) {
            const bookDetails = await bookDataMapper.getBookByIsbn(book.isbn)
            bookCollectionWithDetails.push(bookDetails)
        }

        res.json(bookCollectionWithDetails);
    },

    async addBook(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            return res.status(500).json({ error: "no user" })
        }

        const result = addOrDeleteBookRequest.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json(result.error);
        }

        // récupérer tous les Ids des collections appartenant à l'user, pour l'instant une seule
        const ownedCollectionsId = await collectionDataMapper.getCollectionsIdByUserId(user.id)

        // si la collection dans laquelle on veut ajouter le livre n'appartient pas à l'user
        if (!ownedCollectionsId.includes(result.data.collection_id)) {
            return res.status(401).json({ error: "no" })
        }

        const addedBook = await collectionDataMapper.addBook(result.data.isbn, result.data.collection_id)

        return res.json(addedBook);
    },

    async deleteBook(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            return res.status(500).json({ error: "no user" })
        }

        const result = addOrDeleteBookRequest.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json(result.error);
        }

        // récupérer tous les Ids des collections appartenant à l'user, pour l'instant une seule
        const ownedCollectionsId = await collectionDataMapper.getCollectionsIdByUserId(user.id)

        // si la collection dans laquelle on veut ajouter le livre n'appartient pas à l'user
        if (!ownedCollectionsId.includes(result.data.collection_id)) {
            return res.status(401).json({ error: "no" })
        }

        const isDeleted = await collectionDataMapper.deleteBook(result.data.isbn, result.data.collection_id)

        return res.json(isDeleted);
    },

    // Vérifier si un livre est déjà dans la collection: Boolean pour savoir si on affiche "ajouter" ou "retirer"
    async hasBook(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
        return res.status(500).json({ error: "no user" });
    }

    const { isbn } = req.params;

    // Validation ISBN
    const result = isValidIsbn.safeParse({ isbn });
    if (!result.success) {
        const message = result.error.issues[0].message;
        return res.status(400).json({ message });
    }

    try {
        const bookInCollection = await collectionDataMapper.hasBookInUserCollection(
            isbn,
            user.id
        );

        // bookInCollection doit être un boolean
        return res.json(!!bookInCollection);  
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


    /* Mettre à jour la visibilité de la collection: publique/privée
    async updateVisibility(req: Request, res: Response) {

    }, */
}

export default collectionController;