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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
