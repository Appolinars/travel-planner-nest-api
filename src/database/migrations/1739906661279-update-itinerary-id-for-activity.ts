import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateItineraryIdForActivity1739906661279
  implements MigrationInterface
{
  name = 'UpdateItineraryIdForActivity1739906661279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_afdf466247ae36c392d3d352e09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" RENAME COLUMN "itineraryId" TO "itinerary_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ALTER COLUMN "itinerary_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_5ec6a160eac65166c9ab523fea6" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_5ec6a160eac65166c9ab523fea6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ALTER COLUMN "itinerary_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" RENAME COLUMN "itinerary_id" TO "itineraryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_afdf466247ae36c392d3d352e09" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
