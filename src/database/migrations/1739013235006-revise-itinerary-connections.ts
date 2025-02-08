import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReviseItineraryConnections1739013235006
  implements MigrationInterface
{
  name = 'ReviseItineraryConnections1739013235006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itineraries" DROP CONSTRAINT "FK_af3ea3e3c2cf39c628d9269c255"`,
    );
    await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "PK_63254f2f40d9360b20e934adbf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "PK_63254f2f40d9360b20e934adbf4" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "PK_63254f2f40d9360b20e934adbf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "PK_63254f2f40d9360b20e934adbf4" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD "ownerId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD CONSTRAINT "FK_af3ea3e3c2cf39c628d9269c255" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
