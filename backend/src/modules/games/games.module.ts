import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/games.entity';
import { GameController } from './games.controller';
import { GameService } from './games.service';
import { SystemReqMinModule } from '../system_req_min/system_req_min.module';
import { SystemReqMaxModule } from '../system_req_max/system_req_max.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    SystemReqMinModule,
    SystemReqMaxModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
