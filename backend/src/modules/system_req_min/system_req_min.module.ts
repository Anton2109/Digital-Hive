import { Module } from '@nestjs/common';
import { SystemReqMinService } from './system_req_min.service';
import { SystemReqMinController } from './system_req_min.controller';
import { SystemReqMin } from './entities/system_req_min.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemReqMin]),
  ],
  controllers: [SystemReqMinController],
  providers: [SystemReqMinService],
  exports: [TypeOrmModule],
})
export class SystemReqMinModule {}
