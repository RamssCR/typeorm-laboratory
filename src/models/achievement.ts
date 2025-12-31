import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.ts';
import { UserToAchievement } from './UserToAchievement.ts';

@Entity()
export class Achievement extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 125 })
  description: string;

  @Column({ type: 'int' })
  points: number;

  @OneToMany(
    () => UserToAchievement,
    (userToAchievement) => userToAchievement.achievement,
  )
  userToAchievements: UserToAchievement[];
}
