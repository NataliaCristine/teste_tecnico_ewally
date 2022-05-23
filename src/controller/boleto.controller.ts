import { Request, Response, NextFunction } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import BoletoRepository from "../repositories/boletoRepository";
import {
  metodoDigitoVerificavelBoletoBancario,
  dataVencimento,
  digitoverificador,
  salvandoData,
  getBoleto,
  digitoVerificavelConvenio10,
  digitoVerificavelConvenio11,
} from "../services/boleto.service";
import AppError from "../erros/AppError";

export const boletos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linhadigitavel = req.params.uuid;

    const data =
      linhadigitavel[0] !== "8"
        ? await controllerBoleto(linhadigitavel)
        : await controllerConvenio(linhadigitavel);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const controllerBoleto = async (linhadigitavel: string) => {
  try {
    let barCode = "";
    const valorCampo1 = linhadigitavel.slice(0, 10);
    metodoDigitoVerificavelBoletoBancario(valorCampo1);
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
      throw new AppError("Digitos inválidos", 400);
    }

    barCode = barcodeParcial.slice(0, 4) + digito + barcodeParcial.slice(4);

    const data = {
      amount: valor,
      expirationDate: vencimento,
      barCode: barCode,
    };

    const dataBanco = {
      amount: Number(linhadigitavel.slice(37)),
      expirationDate: new Date(vencimento),
      barCode: barCode,
    };
    const salveBanco = await salvandoData(dataBanco);
    if (salveBanco) {
      const getBoletoBanco = await getBoleto(salveBanco.barCode);
      console.log(getBoletoBanco);
    }

    return data;
  } catch (err) {
    throw new AppError("Digitos inválidos", 400);
  }
};

const controllerConvenio = (linhaDigitavel: string) => {
  const campo1 = linhaDigitavel.slice(0, 11);
  const campo2 = linhaDigitavel.slice(11, 22);
  const campo3 = linhaDigitavel.slice(22, 33);
  const campo4 = linhaDigitavel.slice(33, 44);

  const digitoVerificavel = `${linhaDigitavel.slice(
    0,
    3
  )}${linhaDigitavel.slice(4)}`;

  let dg1,
    dg2,
    dg3,
    dg4,
    dgUnicoVerificavel = 0;

  if (linhaDigitavel[2] == "6" || linhaDigitavel[2] == "7") {
    dg1 = digitoVerificavelConvenio10(campo1);
    dg2 = digitoVerificavelConvenio10(campo2);
    dg3 = digitoVerificavelConvenio10(campo3);
    dg4 = digitoVerificavelConvenio10(campo4);

    dgUnicoVerificavel = digitoVerificavelConvenio10(digitoVerificavel);
  } else if (linhaDigitavel[2] == "8" || linhaDigitavel[2] == "9") {
    dg1 = digitoVerificavelConvenio11(campo1);
    dg2 = digitoVerificavelConvenio11(campo2);
    dg3 = digitoVerificavelConvenio11(campo3);
    dg4 = digitoVerificavelConvenio11(campo4);

    dgUnicoVerificavel = digitoVerificavelConvenio11(digitoVerificavel);
  } else {
    throw new AppError("Digitos inválidos", 400);
  }

  const valor = (Number(linhaDigitavel.slice(4, 15)) / 100).toFixed(2);

  if (dgUnicoVerificavel !== Number(linhaDigitavel[3])) {
    throw new AppError("Digitos inválidos", 400);
  }
  const barCode = `${campo1}${dg1}${campo2}${dg2}${campo3}${dg3}${campo4}${dg4}`;
  const data = { amount: valor, barCode };

  return data;
};
