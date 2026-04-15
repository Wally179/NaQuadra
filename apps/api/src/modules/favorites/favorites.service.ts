// ============================================================
// Na Quadra — Favorites Service (MySQL)
// ============================================================
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favRepo: Repository<FavoriteEntity>,
  ) {}

  async findByUser(userId: string) {
    return this.favRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndType(userId: string, entityType: 'team' | 'player') {
    return this.favRepo.find({
      where: { userId, entityType },
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: string, entityType: 'team' | 'player', entityId: string) {
    const exists = await this.favRepo.findOne({
      where: { userId, entityType, entityId },
    });

    if (exists) {
      throw new ConflictException('Favorito já adicionado');
    }

    const fav = this.favRepo.create({ userId, entityType, entityId });
    return this.favRepo.save(fav);
  }

  async remove(userId: string, entityType: 'team' | 'player', entityId: string) {
    const result = await this.favRepo.delete({ userId, entityType, entityId });
    return { removed: (result.affected ?? 0) > 0 };
  }

  async isFavorite(userId: string, entityType: 'team' | 'player', entityId: string) {
    const count = await this.favRepo.count({
      where: { userId, entityType, entityId },
    });
    return count > 0;
  }
}
