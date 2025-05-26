import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(sessionId: string, email: string): Promise<Order> {
    return this.ordersRepository.manager.transaction(async (manager) => {
      const cartItems = await manager
        .createQueryBuilder(Cart, 'cart')
        .where('cart.session_id = :sessionId', { sessionId })
        .getMany();

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const order = await manager.save(Order, {
        email,
        status: 'pending',
      });

      try {
        for (const item of cartItems) {
          const reserveUrl = `http://game-service:3000/game-keys/reserve/${item.game_id}`;
          
          try {
            await firstValueFrom(
              this.httpService.post(reserveUrl, { 
                quantity: item.quantity,
                order_id: order.id 
              }),
            );
          } catch (error) {
            throw error;
          }
        }

        await manager
          .createQueryBuilder()
          .delete()
          .from(Cart)
          .where('session_id = :sessionId', { sessionId })
          .execute();

        return order;
      } catch (error) {
        const cancelUrl = `http://game-service:3000/game-keys/cancel/${order.id}`;
        
        try {
          await firstValueFrom(this.httpService.post(cancelUrl));
        } catch (cancelError) {
          throw cancelError;
        }
        
        throw error;
      }
    });
  }

  async confirmOrder(orderId: number): Promise<void> {
    return this.ordersRepository.manager.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      if (order.status !== 'pending') {
        throw new Error(`Order ${orderId} is not in pending status`);
      }

      try {
        const confirmUrl = `http://game-service:3000/game-keys/confirm/${orderId}`;
        await firstValueFrom(this.httpService.post(confirmUrl));

        const keysUrl = `http://game-service:3000/game-keys/order/${orderId}`;
        const keysResponse = await firstValueFrom(this.httpService.get(keysUrl));
        const gameKeys = keysResponse.data;

        await this.emailService.sendGameKeys(order.email, gameKeys);
        await manager.update(Order, orderId, { status: 'completed' });
      } catch (error) {
        const cancelUrl = `http://game-service:3000/game-keys/cancel/${orderId}`;
        
        try {
          await firstValueFrom(this.httpService.post(cancelUrl));
        } catch (cancelError) {
          throw cancelError;
        }
        
        throw error;
      }
    });
  }
} 