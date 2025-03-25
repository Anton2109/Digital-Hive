import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameInfo } from './entities/game-info.entity';

@Injectable()
export class GameInfoService {
  constructor(
    @InjectRepository(GameInfo)
    private gameInfoRepository: Repository<GameInfo>,
  ) {}

  async findOne(id: number) {
    const gameInfo = await this.gameInfoRepository.findOne({
      where: { gameId: id },
    });

    if (!gameInfo) {
      throw new NotFoundException(`Информация по игре с id: ${id} не найдена`);
    }

    return gameInfo;
  }
}
