// ============================================================
// Na Quadra — Players Service
// ============================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { EspnService } from '../espn/espn.service';
import { slugToEspnId, espnIdToSlug } from '../espn/team-mapping';

@Injectable()
export class PlayersService {
  constructor(private readonly espnService: EspnService) {}

  async findByTeam(teamId: string) {
    // Accept both slugs ('bos') and ESPN IDs ('2')
    const espnId = slugToEspnId(teamId);
    const roster = await this.espnService.getTeamRoster(espnId);
    return roster;
  }

  async findById(playerId: string) {
    const player = await this.espnService.getPlayerDetails(playerId);
    if (!player) {
      throw new NotFoundException(`Jogador '${playerId}' não encontrado`);
    }

    return {
      ...player,
      teamId: slugToEspnId(player.teamId) === player.teamId ? espnIdToSlug(player.teamId) : player.teamId,
    };
  }
}

