import { Expose } from 'class-transformer';

export class AchievementResponse {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  special: boolean;

  @Expose()
  points: number;
}
