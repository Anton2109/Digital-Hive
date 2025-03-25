import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GameInfoService } from './game-info.service';

@Controller('game-info')
export class GameInfoController {
  constructor(private readonly gameInfoService: GameInfoService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const gameInfo = await this.gameInfoService.findOne(+id);
    if (!gameInfo) {
      throw new NotFoundException(`Информация по игре с id: ${id} не найдена`);
    }
    return gameInfo;
  }
}
