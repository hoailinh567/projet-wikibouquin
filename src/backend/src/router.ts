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
router.get('/api/me', authenticate, profileController.getMyProfile);
router.get('/api/profile/:username', profileController.getUserProfile);

// Collection
router.get('/api/edit-my-collection', authenticate, collectionController.manageMyCollection);
router.post('/api/edit-my-collection/add', authenticate, collectionController.addBook);
router.delete('/api/edit-my-collection/delete', authenticate, collectionController.deleteBook);
router.get('/api/has-book/:isbn', authenticate, collectionController.hasBook);
//router.patch('/api/edit-my-collection/update-visibility', authenticate, collectionController.updateVisibility)


export default router;