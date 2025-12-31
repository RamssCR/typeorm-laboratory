import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.ts';
import { User } from './user.ts';

@Entity()
export class Token extends BaseEntity {
  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: Promise<User>;
}
