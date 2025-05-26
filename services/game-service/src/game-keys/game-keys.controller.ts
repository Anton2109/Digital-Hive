import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { GameKeysService } from './game-keys.service';

@Controller('game-keys')
export class GameKeysController {
  constructor(private readonly gameKeysService: GameKeysService) {}

  @Post('reserve/:gameId')
  async reserveKeys(
    @Param('gameId') gameId: number,
    @Body() body: { quantity: number; order_id: number },
  ) {
    return this.gameKeysService.reserveKeys(gameId, body.quantity, body.order_id);
  }

  @Post('confirm/:orderId')
  async confirmKeys(@Param('orderId') orderId: number) {
    return this.gameKeysService.confirmKeys(orderId);
  }

  @Post('cancel/:orderId')
  async cancelReservation(@Param('orderId') orderId: number) {
    return this.gameKeysService.cancelReservation(orderId);
  }

  @Get('order/:orderId')
  async getOrderKeys(@Param('orderId') orderId: number) {
    return this.gameKeysService.getOrderKeys(orderId);
  }
} 