import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../games/entities/games.entity';
import { GameInfo } from '../game-info/entities/game-info.entity';
import { SystemReqMin } from '../system_req_min/entities/system_req_min.entity';
import { SystemReqMax } from '../system_req_max/entities/system_req_max.entity';
import { pathsConfig } from '../../config/paths.config';

@Injectable()
export class GameByIdService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameInfo)
    private gameInfoRepository: Repository<GameInfo>,
    @InjectRepository(SystemReqMin)
    private systemReqMinRepository: Repository<SystemReqMin>,
    @InjectRepository(SystemReqMax)
    private systemReqMaxRepository: Repository<SystemReqMax>,
  ) {}

  async findOne(id: number) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: [
        'categories',
        'gameInfo',
        'minRequirements',
        'maxRequirements',
      ],
    });

    if (!game) {
      throw new NotFoundException(`Игра по Id: ${id} не найдена`);
    }

    return {
      id: game.id,
      name: game.name,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
      price: game.price,
      categories: game.categories,
      info: {
        description: game.gameInfo?.description || 'Описание отсутствует',
      },
      systemRequirements: {
        minimum: game.minRequirements
          ? {
              windows: game.minRequirements.windows,
              processor: game.minRequirements.processor,
              RAM: game.minRequirements.RAM,
              graphicsCard: game.minRequirements.graphicsCard,
              DirectX: game.minRequirements.DirectX,
              DiskSpace: game.minRequirements.DiskSpace,
            }
          : null,
        recommended: game.maxRequirements
          ? {
              windows: game.maxRequirements.windows,
              processor: game.maxRequirements.processor,
              RAM: game.maxRequirements.RAM,
              graphicsCard: game.maxRequirements.graphicsCard,
              DirectX: game.maxRequirements.DirectX,
              DiskSpace: game.maxRequirements.DiskSpace,
            }
          : null,
      },
    };
  }
}
