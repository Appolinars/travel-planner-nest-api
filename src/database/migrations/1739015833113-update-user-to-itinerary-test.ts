import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserToItineraryTest1739015833113 implements MigrationInterface {
    name = 'UpdateUserToItineraryTest1739015833113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "test" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "test"`);
    }

}
