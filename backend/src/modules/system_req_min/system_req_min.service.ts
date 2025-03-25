import { Injectable } from '@nestjs/common';
import { CreateSystemReqMinDto } from './dto/create-system_req_min.dto';

@Injectable()
export class SystemReqMinService {
  create(createSystemReqMinDto: CreateSystemReqMinDto) {
    return 'This action adds a new systemReqMin';
  }

  findAll() {
    return `This action returns all systemReqMin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemReqMin`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemReqMin`;
  }
}
