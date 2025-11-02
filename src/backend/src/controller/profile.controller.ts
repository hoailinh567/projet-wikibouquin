import type { Request, Response } from "express";

const profileController = {
    getMyProfile(req: Request, res: Response) {
        const user = req.user
        if (!user) {
            res.status(500).json({ error: "no user" })
        }

        res.json(user);
    }
}

export default profileController;