import { Request, Response, NextFunction } from "express";
import AppError from "../erros/AppError";

export const verificandoStringParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uuid = req.params.uuid;
  const num = "0123456789";
  if (uuid) {
    for (let i = 0; i < uuid.length; i++) {
      let boleano = num.includes(uuid[i]);
      if (!boleano) {
        return next(
          new AppError(
            "Digite apenas os números sem espaços, barras, pontos ou traços",
            400
          )
        );
      }
    }
  }

  next();
};
