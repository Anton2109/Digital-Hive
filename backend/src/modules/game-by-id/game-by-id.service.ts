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
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    const [gameInfo, minReq, maxReq] = await Promise.all([
      this.gameInfoRepository.findOne({
        where: { gameId: id },
      }),
      this.systemReqMinRepository.findOne({
        where: { gameId: id },
      }),
      this.systemReqMaxRepository.findOne({
        where: { gameId: id },
      }),
    ]);

    return {
      id: game.id,
      name: game.name,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
      price: game.price,
      info: {
        description: gameInfo?.description,
      },
      systemRequirements: {
        minimum: minReq
          ? {
              windows: minReq.windows,
              processor: minReq.processor,
              RAM: minReq.RAM,
              graphicsCard: minReq.graphicsCard,
              DirectX: minReq.DirectX,
              DiskSpace: minReq.DiskSpace,
            }
          : null,
        recommended: maxReq
          ? {
              windows: maxReq.windows,
              processor: maxReq.processor,
              RAM: maxReq.RAM,
              graphicsCard: maxReq.graphicsCard,
              DirectX: maxReq.DirectX,
              DiskSpace: maxReq.DiskSpace,
            }
          : null,
      },
    };
  }
}
