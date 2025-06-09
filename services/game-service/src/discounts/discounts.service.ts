import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Discount } from './discounts.entity';
import { DiscountResponseDto } from './dto/discount-response.dto';

@Injectable()
export class DiscountsService {
  private readonly logger = new Logger(DiscountsService.name);

  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>,
  ) {}

  async create(discountData: Partial<Discount>): Promise<Discount> {
    try {
      this.logger.debug(
        `Создание скидки с данными: ${JSON.stringify(discountData)}`,
      );
      const discount = this.discountsRepository.create({
        ...discountData,
        start_date: new Date(discountData.start_date),
        end_date: new Date(discountData.end_date),
      });
      const savedDiscount = await this.discountsRepository.save(discount);
      this.logger.debug(
        `Скидка успешно создана: ${JSON.stringify(savedDiscount)}`,
      );
      return savedDiscount;
    } catch (error) {
      this.logger.error(
        `Ошибка при создании скидки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Ошибка при создании скидки: ' + error.message,
      );
    }
  }

  async findAll(): Promise<DiscountResponseDto[]> {
    try {
      this.logger.debug('Получение списка всех скидок');
      const discounts = await this.discountsRepository.find({
        relations: ['game'],
      });
      this.logger.debug(`Найдено скидок: ${discounts.length}`);

      if (!discounts || discounts.length === 0) {
        this.logger.debug('Скидки не найдены, возвращаем пустой массив');
        return [];
      }

      const formattedDiscounts: DiscountResponseDto[] = discounts.map(
        (discount) => {
          this.logger.debug(`Обработка скидки ID: ${discount.id}, game_id: ${discount.game_id}`);
          return {
            id: discount.id,
            game_id: discount.game_id,
            discount_percent: discount.discount_percent,
            start_date: discount.start_date,
            end_date: discount.end_date,
            is_active: discount.is_active,
            game: discount.game ? {
              id: discount.game.id,
              name: discount.game.name,
              price: discount.game.price,
              img_path: discount.game.img_path,
            } : null,
          };
        },
      );

      this.logger.debug(`Успешно отформатировано ${formattedDiscounts.length} скидок`);
      return formattedDiscounts;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении списка скидок: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          message: 'Ошибка при получении списка скидок',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Discount> {
    try {
      this.logger.debug(`Поиск скидки с ID: ${id}`);
      const discount = await this.discountsRepository.findOne({
        where: { id },
        relations: ['game'],
      });
      if (!discount) {
        this.logger.warn(`Скидка с ID ${id} не найдена`);
        throw new NotFoundException(`Скидка с ID ${id} не найдена`);
      }
      this.logger.debug(`Скидка найдена: ${JSON.stringify(discount)}`);
      return discount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Ошибка при получении скидки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Ошибка при получении скидки: ' + error.message,
      );
    }
  }

  async update(id: number, discountData: Partial<Discount>): Promise<Discount> {
    try {
      this.logger.debug(
        `Обновление скидки с ID: ${id}, данные: ${JSON.stringify(discountData)}`,
      );
      const discount = await this.findOne(id);
      if (discountData.start_date) {
        discountData.start_date = new Date(discountData.start_date);
      }
      if (discountData.end_date) {
        discountData.end_date = new Date(discountData.end_date);
      }
      await this.discountsRepository.update(id, discountData);
      const updatedDiscount = await this.findOne(id);
      this.logger.debug(
        `Скидка успешно обновлена: ${JSON.stringify(updatedDiscount)}`,
      );
      return updatedDiscount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Ошибка при обновлении скидки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Ошибка при обновлении скидки: ' + error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.debug(`Удаление скидки с ID: ${id}`);
      const discount = await this.findOne(id);
      await this.discountsRepository.delete(id);
      this.logger.debug(`Скидка успешно удалена`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Ошибка при удалении скидки: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Ошибка при удалении скидки: ' + error.message,
      );
    }
  }

  async getActiveDiscounts(): Promise<Discount[]> {
    try {
      this.logger.debug('Получение списка активных скидок');
      const now = new Date();
      const discounts = await this.discountsRepository.find({
        where: {
          is_active: true,
          start_date: LessThanOrEqual(now),
          end_date: MoreThanOrEqual(now),
        },
        relations: ['game'],
      });
      this.logger.debug(`Найдено активных скидок: ${discounts.length}`);
      return discounts;
    } catch (error) {
      this.logger.error(
        `Ошибка при получении активных скидок: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Ошибка при получении активных скидок: ' + error.message,
      );
    }
  }
}
