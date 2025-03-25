import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { GameService } from './games.service';
import { GameWithRequirementsDto } from '../../common/dto/game-with-requirements.dto';
import { Game } from './entities/games.entity';

@Controller('games')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Game> {
    return this.gameService.findOne(+id);
  }

  @Get('search/:query')
  async search(@Param('query') query: string): Promise<Game[]> {
    return this.gameService.search(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGameDto: GameWithRequirementsDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.gameService.remove(+id);
  }
}
