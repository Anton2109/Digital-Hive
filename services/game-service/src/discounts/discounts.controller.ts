import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Discount } from './discounts.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DiscountResponseDto } from './dto/discount-response.dto';

@Controller('discounts')
export class DiscountsController {
  private readonly logger = new Logger(DiscountsController.name);

  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createDiscountDto: Partial<Discount>,
  ): Promise<Discount> {
    this.logger.debug(
      `Получен запрос на создание скидки: ${JSON.stringify(createDiscountDto)}`,
    );
    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  async findAll(): Promise<DiscountResponseDto[]> {
    this.logger.debug('Получен запрос на получение списка всех скидок');
    try {
      const discounts = await this.discountsService.findAll();
      this.logger.debug(`Успешно получено ${discounts.length} скидок`);
      return discounts;
    } catch (error) {
      this.logger.error(`Ошибка при получении скидок: ${error.message}`);
      this.logger.error(`Стек ошибки: ${error.stack}`);
      throw new HttpException(
        {
          message: 'Ошибка при получении списка скидок',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('active')
  async getActiveDiscounts(): Promise<Discount[]> {
    this.logger.debug('Получен запрос на получение списка активных скидок');
    return this.discountsService.getActiveDiscounts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Discount> {
    this.logger.debug(`Получен запрос на получение скидки с ID: ${id}`);
    return this.discountsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: Partial<Discount>,
  ): Promise<Discount> {
    this.logger.debug(
      `Получен запрос на обновление скидки с ID: ${id}, данные: ${JSON.stringify(updateDiscountDto)}`,
    );
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.debug(`Получен запрос на удаление скидки с ID: ${id}`);
    return this.discountsService.remove(+id);
  }
}
