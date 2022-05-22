import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Boleto {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ nullable: false })
  amount!: number;

  @Column({ nullable: false })
  expirationDate!: Date;

  @Column()
  barCode!: string;
}
