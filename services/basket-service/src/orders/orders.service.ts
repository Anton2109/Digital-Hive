import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(sessionId: string, email: string): Promise<Order> {
    this.logger.log(`Начало создания заказа для сессии ${sessionId} и email ${email}`);
    
    return this.ordersRepository.manager.transaction(async (manager) => {
      const cartItems = await manager
        .createQueryBuilder(Cart, 'cart')
        .where('cart.session_id = :sessionId', { sessionId })
        .getMany();

      this.logger.log(`Найдено ${cartItems.length} товаров в корзине`);

      if (cartItems.length === 0) {
        this.logger.error('Корзина пуста');
        throw new Error('Корзина пуста');
      }

      const order = await manager.save(Order, {
        email,
        status: 'pending',
      });

      this.logger.log(`Создан заказ с ID ${order.id}`);

      try {
        for (const item of cartItems) {
          const reserveUrl = `http://game-service:3000/game-keys/reserve/${item.game_id}`;
          this.logger.log(`Попытка резервирования ключей для игры ${item.game_id} в количестве ${item.quantity} для заказа ${order.id} по URL: ${reserveUrl}`);

          try {
            const response = await firstValueFrom(
              this.httpService.post(reserveUrl, {
                quantity: item.quantity,
                order_id: order.id,
              }),
            );
            this.logger.log(`Успешно зарезервированы ключи для игры ${item.game_id}, ответ: ${JSON.stringify(response.data)}`);
          } catch (error) {
            this.logger.error(`Ошибка при резервировании ключей для игры ${item.game_id}: ${error.message}`);
            if (error.response) {
              this.logger.error(`Ответ сервера: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
          }
        }

        await manager
          .createQueryBuilder()
          .delete()
          .from(Cart)
          .where('session_id = :sessionId', { sessionId })
          .execute();

        this.logger.log(`Корзина для сессии ${sessionId} очищена`);
        return order;
      } catch (error) {
        this.logger.error(`Ошибка при создании заказа: ${error.message}`);
        const cancelUrl = `http://game-service:3000/game-keys/cancel/${order.id}`;

        try {
          this.logger.log(`Попытка отмены резервирования для заказа ${order.id} по URL: ${cancelUrl}`);
          await firstValueFrom(this.httpService.post(cancelUrl));
          this.logger.log(`Успешно отменено резервирование для заказа ${order.id}`);
        } catch (cancelError) {
          this.logger.error(`Ошибка при отмене резервирования: ${cancelError.message}`);
          throw cancelError;
        }

        throw error;
      }
    });
  }

  async confirmOrder(orderId: number): Promise<void> {
    this.logger.log(`Начало подтверждения заказа ${orderId}`);
    
    return this.ordersRepository.manager.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
      });

      if (!order) {
        this.logger.error(`Заказ ${orderId} не найден`);
        throw new Error(`Заказ ${orderId} не найден`);
      }

      this.logger.log(`Статус заказа ${orderId}: ${order.status}`);

      if (order.status !== 'pending') {
        this.logger.error(`Заказ ${orderId} не находится в статусе 'pending'`);
        throw new Error(`Заказ ${orderId} не находится в статусе 'pending'`);
      }

      try {
        const confirmUrl = `http://game-service:3000/game-keys/confirm/${orderId}`;
        this.logger.log(`Попытка подтверждения ключей для заказа ${orderId} по URL: ${confirmUrl}`);
        await firstValueFrom(
          this.httpService.post(confirmUrl, { email: order.email })
        );
        this.logger.log(`Успешно подтверждены ключи для заказа ${orderId}`);

        const keysUrl = `http://game-service:3000/game-keys/order/${orderId}`;
        this.logger.log(`Получение ключей для заказа ${orderId} по URL: ${keysUrl}`);
        const keysResponse = await firstValueFrom(
          this.httpService.get(keysUrl),
        );
        const gameKeys = keysResponse.data;
        this.logger.log(`Получено ${gameKeys.length} ключей для заказа ${orderId}`);

        this.logger.log(`Отправка ключей на email ${order.email}`);
        await this.emailService.sendGameKeys(order.email, gameKeys);
        this.logger.log(`Ключи успешно отправлены на email ${order.email}`);

        await manager.update(Order, orderId, { status: 'completed' });
        this.logger.log(`Заказ ${orderId} помечен как выполненный`);
      } catch (error) {
        this.logger.error(`Ошибка при подтверждении заказа: ${error.message}`);
        if (error.response) {
          this.logger.error(`Ответ сервера: ${JSON.stringify(error.response.data)}`);
        }
        const cancelUrl = `http://game-service:3000/game-keys/cancel/${orderId}`;

        try {
          this.logger.log(`Попытка отмены резервирования для заказа ${orderId} по URL: ${cancelUrl}`);
          await firstValueFrom(this.httpService.post(cancelUrl));
          this.logger.log(`Успешно отменено резервирование для заказа ${orderId}`);
        } catch (cancelError) {
          this.logger.error(`Ошибка при отмене резервирования: ${cancelError.message}`);
          throw cancelError;
        }

        throw error;
      }
    });
  }
}
