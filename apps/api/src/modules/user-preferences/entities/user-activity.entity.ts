// ============================================================
// Na Quadra — Entity: UserActivity (TypeORM)
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('user_activity')
export class UserActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'varchar' })
  activityType!: 'article_read' | 'team_viewed' | 'player_viewed' | 'game_viewed';

  @Column({ type: 'varchar', nullable: true })
  entityId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
