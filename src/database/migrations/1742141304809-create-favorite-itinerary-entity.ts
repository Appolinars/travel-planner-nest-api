import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoriteItineraryEntity1742141304809
  implements MigrationInterface
{
  name = 'CreateFavoriteItineraryEntity1742141304809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorite_itineraries" ("user_id" integer NOT NULL, "itinerary_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d17eba516230c3375f71148bf62" PRIMARY KEY ("user_id", "itinerary_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_itineraries" ADD CONSTRAINT "FK_d8257f6780821cdd2ba8cb09ca2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_itineraries" ADD CONSTRAINT "FK_e00646f859c9d4b68c6b3194fc4" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_itineraries" DROP CONSTRAINT "FK_e00646f859c9d4b68c6b3194fc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_itineraries" DROP CONSTRAINT "FK_d8257f6780821cdd2ba8cb09ca2"`,
    );
    await queryRunner.query(`DROP TABLE "favorite_itineraries"`);
  }
}
