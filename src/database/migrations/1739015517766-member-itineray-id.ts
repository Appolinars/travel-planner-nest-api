import { MigrationInterface, QueryRunner } from "typeorm";

export class MemberItinerayId1739015517766 implements MigrationInterface {
    name = 'MemberItinerayId1739015517766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP COLUMN "itineraryId"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_4dd6832d9ca711e7f2873057589" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" DROP CONSTRAINT "FK_4dd6832d9ca711e7f2873057589"`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD "itineraryId" integer`);
        await queryRunner.query(`ALTER TABLE "users_to_itinerary" ADD CONSTRAINT "FK_31c849ffd8a039ab79a5c48df8c" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
