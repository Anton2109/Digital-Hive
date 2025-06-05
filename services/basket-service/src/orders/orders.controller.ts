import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body('sessionId') sessionId: string,
    @Body('email') email: string,
  ) {
    return this.ordersService.createOrder(sessionId, email);
  }

  @Post(':orderId/confirm')
  async confirmOrder(@Param('orderId') orderId: number) {
    return this.ordersService.confirmOrder(orderId);
  }
}
