import type { Request, Response } from "express";
import { isValidIsbn } from "../validation/book.validator.ts";
import bookDataMapper from "../dataMapper/book.datamapper.ts";

const bookController = {
  async getBookByIsbn(req: Request, res: Response) {
    const { isbn } = req.params;

    // Validation avec Zod
    const result = isValidIsbn.safeParse({ isbn });
    if (!result.success) {
      const message = result.error.issues[0].message;
      return res.status(400).json({ message });
    }

    try {
      const book = await bookDataMapper.getBookByIsbn(isbn);
      // Si le livre n'existe pas (null/undefined)
      if (!book) {
        return res.status(404).json({ 
          message: `Livre avec l'ISBN ${isbn} introuvable`,
        });
      }
      res.json(book); // 200 OK par défaut, envoi la réponse au format JSON.
    } catch (error: any) {
      console.error("Error in getBookByIsbn:", error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: `Livre avec l'ISBN ${isbn} introuvable` });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default bookController;
