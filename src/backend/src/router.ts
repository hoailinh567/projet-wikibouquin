import { Router } from "express";
import bookController from "./controller/book.controller.ts";
import authController from "./controller/auth.controller.ts";
import authenticate from "./middleware/authenticate.ts";
import profileController from "./controller/profile.controller.ts";
import collectionController from "./controller/collection.controller.ts";

const router = Router();

// Auth
router.post('/api/signup', authController.signUp);
router.post('/api/signin', authController.signIn);
router.post('/api/refresh', authController.refresh);
router.post('/api/logout', authController.logout);

// App
router.get('/api/book/:isbn', bookController.getBookByIsbn);

// User
router.get('/api/my-profile', authenticate, profileController.getMyProfile);

// Collection
router.get('/api/my-collection', authenticate, collectionController.manageMyCollection);
router.post('/api/my-collection/add', authenticate, collectionController.addBook);
router.delete('/api/my-collection/delete', authenticate, collectionController.deleteBook);
router.patch('/api/my-collection/update-visibility', authenticate, collectionController.updateVisibility)


export default router;