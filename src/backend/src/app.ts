import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./router.ts";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);

export default app;