import { Router } from "express";
import { boletos } from "../controller/boleto.controller";

import { verificandoStringParams } from "../middlewares/veri.string.params";

const router = Router();

export const boletoRouter = () => {
  router.get("/:uuid", verificandoStringParams, boletos);

  return router;
};
