import {MigrationInterface, QueryRunner} from "typeorm";

export class createTable1653245214316 implements MigrationInterface {
    name = 'createTable1653245214316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "boleto" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "barCode" integer NOT NULL, CONSTRAINT "PK_410152a0983a3d3d2c29362da0d" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "boleto"`);
    }

}
