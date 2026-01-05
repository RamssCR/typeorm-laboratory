import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.ts';
import type { Token } from './token.ts';
import { UserToAchievement } from './UserToAchievement.ts';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 55, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @OneToMany('Token', (token: Token) => token.user)
  tokens: Token[];

  @OneToMany(
    () => UserToAchievement,
    (userToAchievement) => userToAchievement.user,
  )
  userToAchievements: UserToAchievement[];
}
