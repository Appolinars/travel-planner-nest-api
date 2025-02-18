import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateItineraryIdForExpense1739906817292
  implements MigrationInterface
{
  name = 'UpdateItineraryIdForExpense1739906817292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_f2fbe1028a90f33fbd5451b5f01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" RENAME COLUMN "itineraryId" TO "itinerary_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "itinerary_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_02253afcba03d5acc539d4be3d0" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_02253afcba03d5acc539d4be3d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "itinerary_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" RENAME COLUMN "itinerary_id" TO "itineraryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_f2fbe1028a90f33fbd5451b5f01" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
