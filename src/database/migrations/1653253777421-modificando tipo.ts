import {MigrationInterface, QueryRunner} from "typeorm";

export class modificandoTipo1653253777421 implements MigrationInterface {
    name = 'modificandoTipo1653253777421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boleto" DROP COLUMN "barCode"`);
        await queryRunner.query(`ALTER TABLE "boleto" ADD "barCode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boleto" DROP COLUMN "barCode"`);
        await queryRunner.query(`ALTER TABLE "boleto" ADD "barCode" integer NOT NULL`);
    }

}
