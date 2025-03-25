import { Injectable } from '@nestjs/common';
import { CreateSystemReqMaxDto } from './dto/create-system_req_max.dto';

@Injectable()
export class SystemReqMaxService {
  create(createSystemReqMaxDto: CreateSystemReqMaxDto) {
    return 'This action adds a new systemReqMax';
  }

  findAll() {
    return `This action returns all systemReqMax`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemReqMax`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemReqMax`;
  }
}
