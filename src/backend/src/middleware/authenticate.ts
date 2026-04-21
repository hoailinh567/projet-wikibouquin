import type { Request, Response, NextFunction } from "express";
import type { PublicUser } from "../models/user.ts";
import jwt from "jsonwebtoken";


// Middleware d'authentification
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as PublicUser;
        res.locals.user = decoded
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default authenticate;