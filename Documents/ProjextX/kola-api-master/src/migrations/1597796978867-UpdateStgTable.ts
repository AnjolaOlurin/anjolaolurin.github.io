import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateStgTable1597796978867 implements MigrationInterface {
    name = 'UpdateStgTable1597796978867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "user_status_enum" AS ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'TERMINATED')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "firstName" character varying(50), "lastName" character varying(50), "gender" "user_gender_enum", "birthDate" date, "phone" character varying(50) NOT NULL, "phoneConfirmed" boolean NOT NULL DEFAULT false, "referalCode" character varying(50), "email" character varying(50) NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "bvn" character varying(11), "bvnRawData" jsonb, "bvnConfirmed" boolean NOT NULL DEFAULT false, "securityToken" character varying(16), "securityTokenRequestedAt" TIMESTAMP WITH TIME ZONE, "securityOperationPerformedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "passwordHash" character varying NOT NULL, "status" "user_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_c360588ec8bbb2f67b59cfe2592" UNIQUE ("publicId"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8f4e25bbcaff2dec17682ccdb9d" UNIQUE ("bvn"), CONSTRAINT "UQ_c2d6dad58d69072a0f873b5d204" UNIQUE ("securityToken"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "basic_report" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "commercialSummary" jsonb, "microfinanceSummary" jsonb, "mortgageSummary" jsonb, "creditRating" character varying, CONSTRAINT "UQ_db969c58fe7dc8c3f95728385b5" UNIQUE ("publicId"), CONSTRAINT "PK_1d9fe0f32ad0633764a8f07b767" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classic_report" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "creditScore" integer NOT NULL, "creditRating" character varying NOT NULL, "creditRatingReasons" character varying array NOT NULL, "totalAmountOverdue" double precision, "commercial" jsonb, "microfinance" jsonb, "mortgage" jsonb, CONSTRAINT "UQ_83d1146ecb78837529f6b18c5c7" UNIQUE ("publicId"), CONSTRAINT "PK_20eaca82418c4d96af18deec1b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "dispute_facilitytype_enum" AS ENUM('COMMERCIAL', 'MICROFINANCE', 'MORTGAGE')`);
        await queryRunner.query(`CREATE TABLE "dispute" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "reportId" character varying NOT NULL, "facilityType" "dispute_facilitytype_enum" NOT NULL, "facilityId" character varying, "message" character varying(300) NOT NULL, CONSTRAINT "UQ_670071b5ae9d019f3caaacb71d0" UNIQUE ("publicId"), CONSTRAINT "PK_e2f1f4741f2094ce789b0a7c5b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "report_overview_status_enum" AS ENUM('PENDING', 'ERRORED', 'FAILED', 'NO_HIT', 'NOT_FOUND', 'GENERATED', 'REQUIRE_PHONE_CHALLENGE')`);
        await queryRunner.query(`CREATE TABLE "report_overview" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "userId" integer NOT NULL, "reportId" integer, "phoneChallenge" character varying array, "phoneChallengePassed" boolean NOT NULL DEFAULT false, "status" "report_overview_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_2a39ddf1bfc5a84f44698a6e1a2" UNIQUE ("publicId"), CONSTRAINT "REL_6950a693f14e36f31ae4630621" UNIQUE ("userId"), CONSTRAINT "PK_496ba4a6865fe1ddf5f17a25066" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wait_list" ("id" SERIAL NOT NULL, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "email" character varying NOT NULL, CONSTRAINT "UQ_94b0604745d50b0e18cc7c4c4a0" UNIQUE ("publicId"), CONSTRAINT "UQ_ec8b0bda206fe65a5cc848fe7b3" UNIQUE ("email"), CONSTRAINT "PK_263b33e683bd5465d873746786f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "basic_report" ADD CONSTRAINT "FK_ad097252dd26115503691991fa8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classic_report" ADD CONSTRAINT "FK_4398db66b2fa7fa302044187093" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispute" ADD CONSTRAINT "FK_71bad39f7cf1c8c259240257bee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_overview" ADD CONSTRAINT "FK_6950a693f14e36f31ae46306212" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_overview" DROP CONSTRAINT "FK_6950a693f14e36f31ae46306212"`);
        await queryRunner.query(`ALTER TABLE "dispute" DROP CONSTRAINT "FK_71bad39f7cf1c8c259240257bee"`);
        await queryRunner.query(`ALTER TABLE "classic_report" DROP CONSTRAINT "FK_4398db66b2fa7fa302044187093"`);
        await queryRunner.query(`ALTER TABLE "basic_report" DROP CONSTRAINT "FK_ad097252dd26115503691991fa8"`);
        await queryRunner.query(`DROP TABLE "wait_list"`);
        await queryRunner.query(`DROP TABLE "report_overview"`);
        await queryRunner.query(`DROP TYPE "report_overview_status_enum"`);
        await queryRunner.query(`DROP TABLE "dispute"`);
        await queryRunner.query(`DROP TYPE "dispute_facilitytype_enum"`);
        await queryRunner.query(`DROP TABLE "classic_report"`);
        await queryRunner.query(`DROP TABLE "basic_report"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_status_enum"`);
        await queryRunner.query(`DROP TYPE "user_gender_enum"`);
    }

}
