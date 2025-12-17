import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.ts';
import { UserToAchievement } from './UserToAchievement.ts';

@Entity()
export class Achievement extends BaseEntity {
  @Column({ type: 'char', length: 50 })
  title: string;

  @Column({ type: 'char', length: 125 })
  description: string;

  @Column({ type: 'int' })
  points: number;

  @OneToMany(
    () => UserToAchievement,
    (userToAchievement) => userToAchievement.achievement,
  )
  userToAchievements: UserToAchievement[];
}
