import { Router } from "express";
import bookController from "./controller/book.controller.ts";
import authController from "./controller/auth.controller.ts";
import authenticate from "./middleware/authenticate.ts";
import profileController from "./controller/profile.controller.ts";

const router = Router();

router.get('/api/book/:isbn', bookController.getBookByIsbn);
router.post('/api/signup', authController.signUp);
router.post('/api/signin', authController.signIn);
router.post('/api/refresh', authController.refresh);
router.post('/api/logout', authController.logout);
router.get('/api/my-profile', authenticate, profileController.getMyProfile);


export default router;