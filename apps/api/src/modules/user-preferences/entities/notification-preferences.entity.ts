// ============================================================
// Na Quadra — Entity: NotificationPreferences (TypeORM)
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

@Entity('notification_preferences')
export class NotificationPreferencesEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'boolean', default: true })
  favoriteTeamNews!: boolean;

  @Column({ type: 'boolean', default: true })
  injuries!: boolean;

  @Column({ type: 'boolean', default: true })
  trades!: boolean;

  @Column({ type: 'boolean', default: true })
  signings!: boolean;

  @Column({ type: 'boolean', default: false })
  preGame60min!: boolean;

  @Column({ type: 'boolean', default: true })
  preGame30min!: boolean;

  @Column({ type: 'boolean', default: true })
  gameStarted!: boolean;

  @Column({ type: 'boolean', default: true })
  gameFinal!: boolean;

  @Column({ type: 'boolean', default: true })
  personalizedNews!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
