import { MigrationInterface, QueryRunner } from 'typeorm';

export class NamingForColumns1739014221220 implements MigrationInterface {
  name = 'NamingForColumns1739014221220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itineraries" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "endDate"`);
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD "start_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD "end_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_cae23439cc5ce1032639737a9bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_cae23439cc5ce1032639737a9bc"`,
    );
    await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "end_date"`);
    await queryRunner.query(
      `ALTER TABLE "itineraries" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD "endDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itineraries" ADD "startDate" TIMESTAMP NOT NULL`,
    );
  }
}
