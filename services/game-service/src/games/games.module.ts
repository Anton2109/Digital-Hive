import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { CategoriesController } from './categories.controller';
import { Game } from './entities/game.entity';
import { Category } from './entities/category.entity';
import { GameInfo } from './entities/game-info.entity';
import { SystemReqMin } from './entities/system-req-min.entity';
import { SystemReqMax } from './entities/system-req-max.entity';
import { UserGame } from './entities/user-game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      Category,
      GameInfo,
      SystemReqMin,
      SystemReqMax,
      UserGame,
    ]),
  ],
  controllers: [GamesController, CategoriesController],
  providers: [GamesService],
})
export class GamesModule {} 