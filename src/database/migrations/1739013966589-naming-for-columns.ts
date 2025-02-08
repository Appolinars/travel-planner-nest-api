import { MigrationInterface, QueryRunner } from "typeorm";

export class NamingForColumns1739013966589 implements MigrationInterface {
    name = 'NamingForColumns1739013966589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "UQ_0af31ee2e864f2d4a9d5e5762d9"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "itinerary_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "itineraries" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "itineraries" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_cae23439cc5ce1032639737a9bc"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ALTER COLUMN "itineraryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "UQ_c8c945342f75368cefb67cb5236" UNIQUE ("user_id", "itinerary_id")`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_cae23439cc5ce1032639737a9bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_cae23439cc5ce1032639737a9bc"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "UQ_c8c945342f75368cefb67cb5236"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ALTER COLUMN "itineraryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_cae23439cc5ce1032639737a9bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "itineraries" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "itinerary_id"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "itineraries" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "itineraries" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "UQ_0af31ee2e864f2d4a9d5e5762d9" UNIQUE ("userId", "itineraryId")`);
    }

}
