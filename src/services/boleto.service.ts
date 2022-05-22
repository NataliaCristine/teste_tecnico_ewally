import { getRepository, getCustomRepository } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { Boleto } from "../entities";
import BoletoRepository from "../repositories/boletoRepository";
import AppError from "../erros/AppError";

interface BoletoBody {
  amount: number;
  expirationDate: Date;
  barCode: string;
}

export const metodoDigitoVerificavelBoletoBancario = (lista: string) => {
  let cont = lista.length - 2;
  let newArray = [];

  // multiplicando da direita para esquerda alternando entre 2 e 1. começando por 2
  while (cont >= 0) {
    if (newArray.length % 2 == 0) {
      newArray.push(parseInt(lista[cont]) * 2);
    } else {
      newArray.push(parseInt(lista[cont]) * 1);
    }
    cont = cont - 1;
  }

  // somando os numeros
  let soma = 0;
  for (let i = 0; i < newArray.length; i++) {
    if (newArray[i] > 9) {
      let somaDoisnumeros = newArray[i].toString();
      let totalSomaDoisnumeros = 0;
      for (let j = 0; j < somaDoisnumeros.length; j++) {
        totalSomaDoisnumeros += parseInt(somaDoisnumeros[j]);
      }
      soma += totalSomaDoisnumeros;
    } else {
      soma += newArray[i];
    }
  }
  // achando proxima dezena

  let proximaDezena = soma.toString();
  let calculandoProximaDezena =
    10 - parseInt(proximaDezena[proximaDezena.length - 1]);
  const dezena = soma + calculandoProximaDezena;

  //achando digito verificador
  const digitoVerificador = dezena - soma;

  if (parseInt(lista[lista.length - 1]) != digitoVerificador) {
    throw new AppError("Digite apenas os numeros", 400);
  }

  return lista.slice(0, lista.length - 1);
};

export const dataVencimento = (fator: string) => {
  const dataAtual = new Date();
  const dataFutura = new Date(2025, 1, 22);
  // data base
  let vencimento = new Date(1997, 9, 7);
  if (dataAtual >= dataFutura) {
    // acima de 2025 nova database
    vencimento = new Date(2025, 1, 22);
  }
  vencimento.setDate(vencimento.getDate() + parseInt(fator));
  const output = `${vencimento.getFullYear()}-${
    vencimento.getMonth() + 1
  }-${vencimento.getDate()}`;
  return output;
};

export const digitoverificador = (data: string) => {
  const newarray = [];
  let peso = 2;

  for (let i = data.length - 1; i >= 0; i--) {
    newarray.push(parseInt(data[i]) * peso);
    peso += 1;

    if (peso == 10) {
      peso = 2;
    }
  }

  const soma = newarray.reduce((value, currentvalue) => value + currentvalue);
  const modDivisao = soma % 11;
  const subtracao = Math.abs(11 - modDivisao);
  let output = 0;
  if (subtracao == 0 || subtracao == 10 || subtracao == 11) {
    output = 1;
  } else {
    output = subtracao;
  }

  return output.toString();
};

export const salvandoData = async (data: BoletoBody) => {
  const saida = await salvandoBoleto(data);
  return saida;
};

export const salvandoBoleto = async (data: BoletoBody) => {
  const boleotRepository = getCustomRepository(BoletoRepository);
  const boleto = await boleotRepository.createBoleto(data);

  return boleto;
};

export const deleteUser = async (userId: string) => {
  const userRepository = getCustomRepository(BoletoRepository);
  const user = await userRepository.findByUUID(userId);
  if (user) {
    await userRepository.remove(user);
    return true;
  } else return false;
};
// campo 1 posição 0-8 tirar o digito verificador posição 9
// campo 2 posição 10 -19 o digito verificador posição 20
// campo 3 posição 21-30 o digito posição 31

// -direita para esquerda multiplica intercalando 2 1
// -resultado for 2 numeros soma eles
// - tdiminui a soma pela próxima dezena

// campo 4 posição 32

// campo 5:
// fator data:  posição 33-36
// valor posição 37-46

// Começou com 8 é convenio
// cada bloco