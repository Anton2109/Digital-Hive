import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemReqMinService } from './system_req_min.service';
import { CreateSystemReqMinDto } from './dto/create-system_req_min.dto';

@Controller('system-req-min')
export class SystemReqMinController {
  constructor(private readonly systemReqMinService: SystemReqMinService) {}

  @Post()
  create(@Body() createSystemReqMinDto: CreateSystemReqMinDto) {
    return this.systemReqMinService.create(createSystemReqMinDto);
  }

  @Get()
  findAll() {
    return this.systemReqMinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemReqMinService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemReqMinService.remove(+id);
  }
}
