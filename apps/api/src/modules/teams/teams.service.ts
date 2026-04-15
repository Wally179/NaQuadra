// ============================================================
// Na Quadra — Teams Service
// ============================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepo: Repository<TeamEntity>,
  ) {}

  async findAll(conference?: string) {
    const qb = this.teamRepo.createQueryBuilder('team');

    if (conference) {
      qb.where('team.conference = :conference', { conference });
    }

    qb.orderBy('team.name', 'ASC');
    return qb.getMany();
  }

  async findById(id: string) {
    const team = await this.teamRepo.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Time '${id}' não encontrado`);
    }
    return team;
  }

  async findByExternalId(externalId: string) {
    return this.teamRepo.findOne({ where: { externalId } });
  }

  // Used by seed and ESPN sync
  async upsert(data: Partial<TeamEntity> & { id: string }) {
    const existing = await this.teamRepo.findOne({ where: { id: data.id } });
    if (existing) {
      await this.teamRepo.update(data.id, data);
      return { ...existing, ...data };
    }
    return this.teamRepo.save(this.teamRepo.create(data));
  }
}
