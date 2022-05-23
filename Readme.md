# Introdução

Uma aplicação consultar linhas digitáveis de boleto de título bancário e pagamento de concessionárias, verificando se a mesma é válida ou não. Sendo válida e
possuindo valor e/ou data de vencimento ter o retorno desses dados.

# Ambiente

## Dependências

- Ambiente Linux ou Windows (WSL2) + NodeJS
- NVM versão utilizada no projeto v16.13.1

## Construindo o Ambiente

Antes de executar as instalações é importante ter o linux atualizado. Podendo utilizar o comando abaixo:

> sudo apt update && upgrade

Em seguida rode o comando:

> yarn

Necessário ter um banco de dados em posgresSql criado e copiar o arqquivo .env.example renomeando para .env
Pode utilizar este comando para copiar:

> cp  .env.example  .env

No arquivo .env será colocado as credenciais do banco.

Gere as migrações:

> yarn typeorm migration:run

# Executar o Projeto

### Esse passo é baixar o projeto

https://github.com/NataliaCristine/teste_tecnico_ewally.git

Se tiver ssh configurada utilize:
git@github.com:NataliaCristine/teste_tecnico_ewally.git

## Rodar o Projeto

Para rodar o projeto deve utilizar o comando:

> yarn run dev

### Utilização

Para utilizar deve utilizar um API Client como Insomnia. No http://localhost:8080

## Rotas e exemplo de uso

### Get

- No caso o uuid é a linha digitável do boleto.

> http://localhost:8080/boleto/uuid

Exemplo:

- GET de titulo
  http://localhost:8080/boleto/21290001192110001210904475617405975870000002000

  Response Status 200 OK

  {
  "amount": "20.00",
  "expirationDate": "2018-7-16",
  "barCode": "21299758700000020000001121100012100447561740"
  }

- GET de Convenio

  Linha divigitável do convenio passada 44 numeros sem o digito verificador de cada bloco.
  exemplo:

  Código de barras: 83600000000 7 39410137202 4 01210002406 1 95350030284 9

  linha digitável: 83600000000394101372020121000240695350030284

  http://localhost:8080/boleto/83600000000394101372020121000240695350030284

  Response Status 200 ok

  {
  "amount": "39.41",
  "barCode": "836000000007394101372024012100024061953500302849"
  }

## Executando os testes

### Rodar o testes

- Rodar o comando:
  > yarn test
