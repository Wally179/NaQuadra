// ============================================================
// Na Quadra — Entity: Favorite (MySQL / TypeORM)
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('favorites')
@Index(['userId', 'entityType', 'entityId'], { unique: true })
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'enum', enum: ['team', 'player'] })
  entityType!: 'team' | 'player';

  @Column({ type: 'varchar', length: 50 })
  entityId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
