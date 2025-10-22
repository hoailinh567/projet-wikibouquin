import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_: Request, res: Response) => {
  res.json({ message: "Bienvenue sur ton backend Express + TypeScript 🚀" });
});

export default router;