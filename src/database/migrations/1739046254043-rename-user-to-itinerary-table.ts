import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserToItineraryTable1739046254043
  implements MigrationInterface
{
  name = 'RenameUserToItineraryTable1739046254043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."itinerary_members_role_enum" AS ENUM('owner', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_members" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "itinerary_id" integer NOT NULL, "role" "public"."itinerary_members_role_enum" NOT NULL DEFAULT 'member', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0adb7e14e8d749ca0dc832a2843" UNIQUE ("user_id", "itinerary_id"), CONSTRAINT "PK_2dccedc870e89aa5201531432d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ADD CONSTRAINT "FK_5f8346d50155251da439adf99ba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ADD CONSTRAINT "FK_1d575e8cda90a38a7c581737f5a" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" DROP CONSTRAINT "FK_1d575e8cda90a38a7c581737f5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" DROP CONSTRAINT "FK_5f8346d50155251da439adf99ba"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_members"`);
    await queryRunner.query(`DROP TYPE "public"."itinerary_members_role_enum"`);
  }
}
