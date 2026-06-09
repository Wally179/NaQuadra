// ============================================================
// Na Quadra — Entity: ContentPreferences (TypeORM)
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('content_preferences')
export class ContentPreferencesEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'varchar', default: 'both' })
  preferredConference!: 'east' | 'west' | 'both';

  @Column({ type: 'boolean', default: true })
  showScoresOnHome!: boolean;

  @Column({ type: 'boolean', default: false })
  compactView!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
