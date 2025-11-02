import "express";
import type { PublicUser } from "../../src/models/user.ts";

// Ajouter un champs à l'interface Request de la lib Express
declare module "express-serve-static-core" {
    interface Request {
        user?: PublicUser;
    }
}
