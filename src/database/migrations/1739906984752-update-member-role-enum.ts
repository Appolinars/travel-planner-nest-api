import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMemberRoleEnum1739906984752 implements MigrationInterface {
  name = 'UpdateMemberRoleEnum1739906984752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop default before changing type
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" DROP DEFAULT`,
    );

    // Step 2: Temporarily change column type to TEXT
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT`,
    );

    // Step 3: Update values from strings to numbers
    await queryRunner.query(
      `UPDATE "itinerary_members" SET "role" = '1' WHERE "role" = 'owner'`,
    );
    await queryRunner.query(
      `UPDATE "itinerary_members" SET "role" = '2' WHERE "role" = 'member'`,
    );

    // Step 4: Rename old enum type
    await queryRunner.query(
      `ALTER TYPE "public"."itinerary_members_role_enum" RENAME TO "itinerary_members_role_enum_old"`,
    );

    // Step 5: Create new enum type
    await queryRunner.query(
      `CREATE TYPE "public"."itinerary_members_role_enum" AS ENUM('1', '2')`,
    );

    // Step 6: Change column type back to new enum
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" TYPE "public"."itinerary_members_role_enum" USING "role"::TEXT::"public"."itinerary_members_role_enum"`,
    );

    // Step 7: Reapply default value
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" SET DEFAULT '2'`,
    );

    // Step 8: Drop old enum type
    await queryRunner.query(
      `DROP TYPE "public"."itinerary_members_role_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop default before changing type
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" DROP DEFAULT`,
    );

    // Step 2: Temporarily change column type to TEXT
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT`,
    );

    // Step 3: Revert numeric values back to strings
    await queryRunner.query(
      `UPDATE "itinerary_members" SET "role" = 'owner' WHERE "role" = '1'`,
    );
    await queryRunner.query(
      `UPDATE "itinerary_members" SET "role" = 'member' WHERE "role" = '2'`,
    );

    // Step 4: Create old enum type again
    await queryRunner.query(
      `CREATE TYPE "public"."itinerary_members_role_enum_old" AS ENUM('owner', 'member')`,
    );

    // Step 5: Change column type back to old enum
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" TYPE "public"."itinerary_members_role_enum_old" USING "role"::TEXT::"public"."itinerary_members_role_enum_old"`,
    );

    // Step 6: Reapply default value
    await queryRunner.query(
      `ALTER TABLE "itinerary_members" ALTER COLUMN "role" SET DEFAULT 'member'`,
    );

    // Step 7: Drop new enum type
    await queryRunner.query(`DROP TYPE "public"."itinerary_members_role_enum"`);

    // Step 8: Rename old enum back to original name
    await queryRunner.query(
      `ALTER TYPE "public"."itinerary_members_role_enum_old" RENAME TO "itinerary_members_role_enum"`,
    );
  }
}
