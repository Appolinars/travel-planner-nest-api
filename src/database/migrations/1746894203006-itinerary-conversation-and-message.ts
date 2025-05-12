import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItineraryConversationAndMessage1746894203006
  implements MigrationInterface
{
  name = 'ItineraryConversationAndMessage1746894203006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "itinerary_messages" ("id" SERIAL NOT NULL, "conversation_id" integer NOT NULL, "content" character varying(20000) NOT NULL, "is_user" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c83e3f535fae9a121d11529ad3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "itinerary_conversations" ("id" SERIAL NOT NULL, "itinerary_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b73d3e860a1b4766a17051a8c14" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_messages" ADD CONSTRAINT "FK_6b7fcc533811f3fbd352620d1f6" FOREIGN KEY ("conversation_id") REFERENCES "itinerary_conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_conversations" ADD CONSTRAINT "FK_a31d4386ee9062d9ef68e68c273" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itinerary_conversations" DROP CONSTRAINT "FK_a31d4386ee9062d9ef68e68c273"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itinerary_messages" DROP CONSTRAINT "FK_6b7fcc533811f3fbd352620d1f6"`,
    );
    await queryRunner.query(`DROP TABLE "itinerary_conversations"`);
    await queryRunner.query(`DROP TABLE "itinerary_messages"`);
  }
}
