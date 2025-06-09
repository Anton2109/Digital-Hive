import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGamesService } from './user-games.service';
import { UserGamesController } from './user-games.controller';
import { UserGame } from './entities/user-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGame])],
  controllers: [UserGamesController],
  providers: [UserGamesService],
  exports: [UserGamesService],
})
export class UserGamesModule {} 