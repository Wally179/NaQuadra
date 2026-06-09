// ============================================================
// Na Quadra — Entity: User (MySQL / TypeORM)
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ type: 'enum', enum: ['user', 'editor', 'admin'], default: 'user' })
  role!: 'user' | 'editor' | 'admin';

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  avatarBase64!: string | null;

  @Column({ type: 'boolean', default: true })
  discoveryMode!: boolean;

  @Column({ type: 'boolean', default: false })
  onboardingCompleted!: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  favoriteTeamId!: string | null;

  @Column({ type: 'simple-array', nullable: true })
  followedTeamIds!: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  favoritePlayerIds!: string[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
