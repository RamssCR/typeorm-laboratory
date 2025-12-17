import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.ts';
import { Token } from './token.ts';
import { UserToAchievement } from './UserToAchievement.ts';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'char', length: 50 })
  username: string;

  @Column({ type: 'char', length: 20 })
  phone: string;

  @Column({ type: 'char', length: 55, unique: true })
  email: string;

  @Column({ type: 'char', length: 255 })
  password: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(
    () => UserToAchievement,
    (userToAchievement) => userToAchievement.user,
  )
  userToAchievements: UserToAchievement[];
}
