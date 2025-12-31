import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialColumnToAchievementEntity1767129686262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "achievement" ADD COLUMN "special" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "achievement" DROP COLUMN "special"`);
  }
}
