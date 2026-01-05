import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.ts';
import type { User } from './user.ts';

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

  @ManyToOne('User', (user: User) => user.tokens, { onDelete: 'CASCADE' })
  user: User;
}
