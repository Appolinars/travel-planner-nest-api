import { MigrationInterface, QueryRunner } from 'typeorm';

export class MemberConnectionsIds1739014800097 implements MigrationInterface {
  name = 'MemberConnectionsIds1739014800097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_cae23439cc5ce1032639737a9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_8566699759ecba4d64abb53298b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_8566699759ecba4d64abb53298b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD "userId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_cae23439cc5ce1032639737a9bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
