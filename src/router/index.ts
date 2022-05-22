import { boletoRouter } from "./boleto.router";
import { Express } from "express";

export const initRouter = (app: Express) => {
  app.use("/boleto", boletoRouter());
};
