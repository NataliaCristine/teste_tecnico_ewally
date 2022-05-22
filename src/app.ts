import "reflect-metadata";
import express from "express";
import { connectDatabase } from "./database";
import { initRouter } from "./router";
import { errorHandler } from "./middlewares/error.middleware";
import dotenv from "dotenv";

dotenv.config();

connectDatabase();

const app = express();

app.use(express.json());

initRouter(app);

app.use(errorHandler);

export default app;
