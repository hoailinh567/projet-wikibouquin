import type { Request, Response } from "express";
import { isValidIsbn } from "../validation/book.validator.ts";
import bookDataMapper from "../dataMapper/book.datamapper.ts";

const bookController = {
  async getBookByIsbn(req: Request, res: Response) {
    const { isbn } = req.params;

    // 🔍 Validation avec Zod
    const result = isValidIsbn.safeParse({ isbn });
    if (!result.success) {
      const message = result.error.issues[0].message;
      return res.status(400).json({ message });
    }

    try {
      const book = await bookDataMapper.getBookByIsbn(isbn);
      res.json(book); // 200 OK par défaut, envoi la réponse au format JSON.
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      console.error(error.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default bookController;
