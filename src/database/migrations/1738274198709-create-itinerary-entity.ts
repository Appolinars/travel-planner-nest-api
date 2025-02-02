import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItineraryEntity1738274198709 implements MigrationInterface {
  name = 'CreateItineraryEntity1738274198709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "itineraries" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "description" character varying(500), "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "destinations" character varying array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer NOT NULL, CONSTRAINT "PK_9c5db87d0f85f56e4466ae09a38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD CONSTRAINT "FK_af3ea3e3c2cf39c628d9269c255" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itineraries" DROP CONSTRAINT "FK_af3ea3e3c2cf39c628d9269c255"`,
    );
    await queryRunner.query(`DROP TABLE "itineraries"`);
  }
}
