import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserToItineraryRemoveTest1739015956559 implements MigrationInterface {
    name = 'UpdateUserToItineraryRemoveTest1739015956559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "test"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "test" character varying NOT NULL`);
    }

}
