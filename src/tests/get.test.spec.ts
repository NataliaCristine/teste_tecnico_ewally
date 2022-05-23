import request from "supertest";
import app from "../app";
import { createConnection, getConnection } from "typeorm";

describe("Testando retorno correto", () => {
  beforeAll(async () => {
    await createConnection();
  });

  afterAll(async () => {
    const conection = getConnection();

    await conection.close();
  });
  it("Esta retornando os dados", async () => {
    const response = await request(app)
      .get("/boleto/21290001192110001210904475617405975870000002000")
      .expect(200);

    expect(response.body.amount).toBe("20.00");
  });
  it("Esta retornando mensagem de erro", async () => {
    const response = await request(app)
      .get("/boleto/212900011921100 01210904475617405975870000002000")
      .expect(400);

    expect(response.body.message).toBe(
      "Digite apenas os números sem espaços, barras, pontos ou traços"
    );
  });
});
