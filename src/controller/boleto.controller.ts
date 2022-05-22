import { Request, Response, NextFunction } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import BoletoRepository from "../repositories/boletoRepository";
import {
  metodoDigitoVerificavelBoletoBancario,
  dataVencimento,
  digitoverificador,
  salvandoData,
} from "../services/boleto.service";
import AppError from "../erros/AppError";

export const boletos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linhadigitavel = req.params.uuid;
    if (linhadigitavel[0] !== "8") {
      let barCode = "";
      const valorCampo1 = linhadigitavel.slice(0, 10);
      const campo1 = metodoDigitoVerificavelBoletoBancario(valorCampo1);
      const campo2 = metodoDigitoVerificavelBoletoBancario(
        linhadigitavel.slice(10, 21)
      );
      const campo3 = metodoDigitoVerificavelBoletoBancario(
        linhadigitavel.slice(21, 32)
      );
      const campo5 = linhadigitavel.slice(33);
      let vencimento = "";
      let valor = "";
      if (campo5.length >= 14) {
        vencimento = dataVencimento(linhadigitavel.slice(33, 37));
        valor = (Number(linhadigitavel.slice(37)) / 100).toFixed(2);
      }

      var barcodeParcial =
        linhadigitavel.slice(0, 4) +
        campo5 +
        linhadigitavel.slice(4, 9) +
        campo2 +
        campo3;

      const digito = digitoverificador(barcodeParcial);
      if (digito != linhadigitavel[32]) {
        throw new AppError("Digite apenas os numeros", 400);
      }

      barCode = barcodeParcial.slice(0, 4) + digito + barcodeParcial.slice(4);

      const data = {
        amount: valor,
        expirationDate: vencimento,
        barCode: barCode,
      };

      const dataBanco = {
        amount: parseFloat(valor),
        expirationDate: new Date(vencimento),
        barCode: barCode,
      };
      const salveBanco = await salvandoData(dataBanco);

      return res.status(200).json(data);
    }
  } catch (err) {
    next(err);
  }
};
