import { Router } from "express";
import bookController from "./controller/book.controller";

const router = Router();

router.get('/api/book/:isbn', bookController.getBookByIsbn);

export default router;