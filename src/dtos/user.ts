import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  points: number;
}
