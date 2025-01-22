import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenIdToRefreshModel1737496067474
  implements MigrationInterface
{
  name = 'AddTokenIdToRefreshModel1737496067474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add the column as nullable
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "token_id" character varying`,
    );

    // Step 2: Populate the column with unique values for existing rows
    await queryRunner.query(
      `UPDATE "refresh_tokens" SET "token_id" = gen_random_uuid()::text`,
    );

    // Step 3: Alter the column to be NOT NULL
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_id" SET NOT NULL`,
    );

    // Step 4: Add the UNIQUE constraint
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "UQ_b4bffc4033b7bd52e241210710c" UNIQUE ("token_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "UQ_b4bffc4033b7bd52e241210710c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "token_id"`,
    );
  }
}
