import type { MigrationInterface, QueryRunner } from 'typeorm';
import achievements from '#seeders/achievements.json' with { type: 'json' };
import { encryptValue } from '#libs/crypto';
import { hashValue } from '#libs/bcrypt';
import users from '#seeders/users.json' with { type: 'json' };
import { writeJson } from '#libs/fs';

type UserWithPassword = (typeof users)[number] & { password: string };

export class SeedDatabase1767186296745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [usersWithPasswords, unhashedUsers] =
      await this.addPasswordToSeeders();

    for (const achievement of achievements) {
      const { title, description, points, special } = achievement;

      await queryRunner.query(
        `INSERT INTO "achievement" ("title", "description", "points", "special")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("title") DO NOTHING
        `,
        [title, description, points, special],
      );
    }

    for (const user of usersWithPasswords) {
      const { email, phone, username, password } = user;

      await queryRunner.query(
        `INSERT INTO "user" ("email", "phone", "username", "password")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("email") DO NOTHING
        `,
        [email, phone, username, password],
      );
    }

    if (Object.keys(unhashedUsers).length > 0)
      await this.generateJSONFile(unhashedUsers);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      queryRunner.query(`DELETE FROM "achievement" WHERE "title" = ANY($1)`, [
        achievements.map((a) => a.title),
      ]),
      queryRunner.query(`DELETE FROM "user" WHERE "email" = ANY($1)`, [
        users.map((u) => u.email),
      ]),
    ]);
  }

  private async addPasswordToSeeders(): Promise<
    [UserWithPassword[], Record<string, string>]
  > {
    const usersWithPasswords = await Promise.all(
      users.map(async (user) => {
        const unhashed = encryptValue();
        const password = await hashValue(unhashed);
        return { ...user, password, unhashed };
      }),
    );

    const unhashedUsers = Object.fromEntries(
      usersWithPasswords.map(({ email, unhashed }) => [email, unhashed]),
    );
    return [usersWithPasswords, unhashedUsers];
  }

  private async generateJSONFile(data: Record<string, string>): Promise<void> {
    await writeJson(data);
  }
}
