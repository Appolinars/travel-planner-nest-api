import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpensesUpdateAmountPrecision1740326007348
  implements MigrationInterface
{
  name = 'ExpensesUpdateAmountPrecision1740326007348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "amount" TYPE numeric(18,6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" ALTER COLUMN "amount" TYPE numeric(10,2)`,
    );
  }
}
