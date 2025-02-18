import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNotesFromActivity1739906497422
  implements MigrationInterface
{
  name = 'RemoveNotesFromActivity1739906497422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "notes"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "notes" character varying(1000)`,
    );
  }
}
