import { Module } from '@nestjs/common';
import { GameByIdService } from './game-by-id.service';
import { GameByIdController } from './game-by-id.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../games/entities/games.entity';
import { GameInfo } from '../game-info/entities/game-info.entity';
import { SystemReqMin } from '../system_req_min/entities/system_req_min.entity';
import { SystemReqMax } from '../system_req_max/entities/system_req_max.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      GameInfo,
      SystemReqMin,
      SystemReqMax
    ])
  ],
  controllers: [GameByIdController],
  providers: [GameByIdService]
})
export class GameByIdModule {}
