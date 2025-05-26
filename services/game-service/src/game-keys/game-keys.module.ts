import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameKeysService } from './game-keys.service';
import { GameKeysController } from './game-keys.controller';
import { GameKey } from './entities/game-key.entity';
import { Game } from '../games/entities/game.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameKey, Game]),
    HttpModule
  ],
  controllers: [GameKeysController],
  providers: [GameKeysService],
  exports: [GameKeysService],
})
export class GameKeysModule {} 