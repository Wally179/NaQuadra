// ============================================================
// Na Quadra — Entity: Team (MySQL / TypeORM)
// ============================================================
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class TeamEntity {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id!: string; // e.g. 'lal', 'bos'

  @Column({ type: 'varchar', length: 10 })
  externalId!: string; // ESPN ID

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 5 })
  abbreviation!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'enum', enum: ['east', 'west'] })
  conference!: 'east' | 'west';

  @Column({ type: 'varchar', length: 50 })
  division!: string;

  @Column({ type: 'varchar', length: 9 })
  colorPrimary!: string;

  @Column({ type: 'varchar', length: 9 })
  colorSecondary!: string;

  @Column({ type: 'varchar', length: 500 })
  logo!: string;

  @Column({ type: 'varchar', length: 150 })
  arena!: string;

  @Column({ type: 'int' })
  founded!: number;

  @Column({ type: 'int', default: 0 })
  championships!: number;

  @Column({ type: 'text', nullable: true })
  history!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
