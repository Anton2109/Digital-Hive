import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { UserGamesService } from './user-games.service';

@Controller('user-games')
export class UserGamesController {
  private readonly logger = new Logger(UserGamesController.name);

  constructor(private readonly userGamesService: UserGamesService) {}

  @Post()
  async addUserGame(
    @Body() body: { email: string; gameId: number; keyId: number },
  ) {
    this.logger.log(
      `Запрос на добавление игры ${body.gameId} для пользователя ${body.email}`,
    );
    return this.userGamesService.addUserGame(
      body.email,
      body.gameId,
      body.keyId,
    );
  }

  @Get(':email')
  async getUserGames(@Param('email') email: string) {
    this.logger.log(`Запрос на получение списка игр для пользователя ${email}`);
    return this.userGamesService.getUserGames(email);
  }
} 