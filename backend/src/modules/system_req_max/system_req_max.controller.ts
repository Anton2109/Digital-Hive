import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SystemReqMaxService } from './system_req_max.service';
import { CreateSystemReqMaxDto } from './dto/create-system_req_max.dto';

@Controller('system-req-max')
export class SystemReqMaxController {
  constructor(private readonly systemReqMaxService: SystemReqMaxService) {}

  @Post()
  create(@Body() createSystemReqMaxDto: CreateSystemReqMaxDto) {
    return this.systemReqMaxService.create(createSystemReqMaxDto);
  }

  @Get()
  findAll() {
    return this.systemReqMaxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemReqMaxService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemReqMaxService.remove(+id);
  }
}
