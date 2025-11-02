import { Router } from "express";
import bookController from "./controller/book.controller.ts";
import authController from "./controller/auth.controller.ts";

const router = Router();

router.get('/api/book/:isbn', bookController.getBookByIsbn);
router.post('/api/signup', authController.signUp);
router.post('/api/signin', authController.signIn);
router.post('/api/refresh', authController.refresh);

export default router;