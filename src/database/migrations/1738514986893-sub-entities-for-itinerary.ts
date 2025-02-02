import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubEntitiesForItinerary1738514986893
  implements MigrationInterface
{
  name = 'SubEntitiesForItinerary1738514986893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "description" character varying(500), "date" TIMESTAMP NOT NULL, "location" character varying(200) NOT NULL, "notes" character varying(1000), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "itineraryId" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_to_itinerary_role_enum" AS ENUM('owner', 'member')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_to_itinerary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer NOT NULL, "itineraryId" integer NOT NULL, "role" "public"."users_to_itinerary_role_enum" NOT NULL DEFAULT 'member', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0af31ee2e864f2d4a9d5e5762d9" UNIQUE ("userId", "itineraryId"), CONSTRAINT "PK_63254f2f40d9360b20e934adbf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL, "notes" character varying(1000), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "itineraryId" integer, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_afdf466247ae36c392d3d352e09" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_cae23439cc5ce1032639737a9bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_f2fbe1028a90f33fbd5451b5f01" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_f2fbe1028a90f33fbd5451b5f01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_cae23439cc5ce1032639737a9bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_afdf466247ae36c392d3d352e09"`,
    );
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "users_to_itinerary"`);
    await queryRunner.query(
      `DROP TYPE "public"."users_to_itinerary_role_enum"`,
    );
    await queryRunner.query(`DROP TABLE "activities"`);
  }
}
