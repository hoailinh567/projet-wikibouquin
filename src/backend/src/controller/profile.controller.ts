import type { Request, Response } from "express";
import userDataMapper from "../dataMapper/user.datamapper.ts";
import collectionDataMapper from "../dataMapper/collection.datamapper.ts";
import bookDataMapper from "../dataMapper/book.datamapper.ts";

const profileController = {
    // Récupère le profil de l'utilisateur connecté pour le page "Mon compte"
    getMyProfile(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            res.status(500).json({ error: "no user" })
        }

        res.json(user);
    },

    // Récupère le profil d'un utilisateur par son username pour la page "Profil public"
    async getUserProfile(req: Request, res: Response) {
        const { username } = req.params;
        const user = await userDataMapper.getUserByUsername(username);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }   
        const collection = await collectionDataMapper.getCollectionByUserId(user.id);
        if (!collection) {
            res.status(404).json({ error: "Collection not found" });
            return;
        }

        if (!collection.books) {
            return res.status(404).json({ error: "no books in collection" })
        }
        
        let bookCollectionWithDetails = [];
        let i = 1;

        for (const book of collection.books) {
            const bookDetails = await bookDataMapper.getBookByIsbn(book.isbn)
            bookCollectionWithDetails.push({
                id: i,
                title: bookDetails.title,
                cover: bookDetails.cover,
                isbn: bookDetails.isbn,
            });
            i++;
        }
        
        res.json(bookCollectionWithDetails);
    },
}

export default profileController;