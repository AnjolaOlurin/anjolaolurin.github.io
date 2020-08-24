import {MigrationInterface, QueryRunner} from "typeorm";

export class subcriptions1598221357648 implements MigrationInterface {
    name = 'subcriptions1598221357648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "subscription_plan_enum" AS ENUM('KOLA_PLUS', 'KOLA_BASIC')`);
        await queryRunner.query(`CREATE TYPE "subscription_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "plan" "subscription_plan_enum" NOT NULL, "status" "subscription_status_enum" NOT NULL DEFAULT 'INACTIVE', "expires" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_6fb6ba0561504104f6e56752d3c" UNIQUE ("publicId"), CONSTRAINT "REL_cc906b4bc892b048f1b654d2aa" UNIQUE ("userId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "type" character varying NOT NULL, "transactionProcessor" character varying NOT NULL, "typeId" integer NOT NULL, "amount" integer NOT NULL, "processorData" jsonb NOT NULL, "verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_027907f9ab5f7a311ab4ea38207" UNIQUE ("publicId"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "subscription_status_enum"`);
        await queryRunner.query(`DROP TYPE "subscription_plan_enum"`);
    }

}
