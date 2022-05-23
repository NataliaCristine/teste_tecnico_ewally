import { Boleto } from "../entities";
import { Repository, EntityRepository, getRepository } from "typeorm";

interface BoletoBody {
  amount: number;
  expirationDate: Date;
  barCode: string;
}

@EntityRepository(Boleto)
class BoletoRepository extends Repository<Boleto> {
  public async createBoleto(data: BoletoBody): Promise<Boleto | undefined> {
    const { amount, expirationDate, barCode } = data;
    const boleto = this.create({ amount, expirationDate, barCode });
    await this.save(boleto);
    return boleto;
  }
  public async findByCode(
    barCode: string | undefined
  ): Promise<Boleto | undefined> {
    const boleto = await this.findOne({
      where: {
        barCode,
      },
    });

    return boleto;
  }
}

export default BoletoRepository;
