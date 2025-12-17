import { Entity, Column, ManyToOne } from 'typeorm';
import { Achievement } from './achievement.ts';
import { BaseEntity } from './base.ts';
import { User } from './user.ts';

@Entity()
export class UserToAchievement extends BaseEntity {
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  achievedAt: Date;

  @ManyToOne(() => User, (user) => user.userToAchievements)
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userToAchievements)
  achievement: Achievement;
}
