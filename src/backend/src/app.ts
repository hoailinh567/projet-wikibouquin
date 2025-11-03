import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./router.ts";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Autoriser les deux pour la flexibilité
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(router);

export default app;