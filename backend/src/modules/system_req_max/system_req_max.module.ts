import { Module } from '@nestjs/common';
import { SystemReqMaxService } from './system_req_max.service';
import { SystemReqMaxController } from './system_req_max.controller';
import { SystemReqMax } from './entities/system_req_max.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemReqMax]),
  ],
  controllers: [SystemReqMaxController],
  providers: [SystemReqMaxService],
  exports: [TypeOrmModule],
})
export class SystemReqMaxModule {}
