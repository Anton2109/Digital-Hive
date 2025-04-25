import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GameByIdService } from './game-by-id.service';

@Controller('game-details')
export class GameByIdController {
  constructor(private readonly gameByIdService: GameByIdService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const game = await this.gameByIdService.findOne(+id);
    if (!game) {
      throw new NotFoundException(`Игра с id: ${id} не найдена`);
    }
    return game;
  }
}
