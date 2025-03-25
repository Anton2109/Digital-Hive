import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInfoService } from './game-info.service';
import { GameInfoController } from './game-info.controller';
import { GameInfo } from './entities/game-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameInfo]),
  ],
  controllers: [GameInfoController],
  providers: [GameInfoService],
})
export class GameInfoModule {}
