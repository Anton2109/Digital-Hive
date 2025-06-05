import { Controller, Post, Body, Param, Get, Logger } from '@nestjs/common';
import { GameKeysService } from './game-keys.service';

@Controller('game-keys')
export class GameKeysController {
  private readonly logger = new Logger(GameKeysController.name);

  constructor(private readonly gameKeysService: GameKeysService) {}

  @Post('reserve/:gameId')
  async reserveKeys(
    @Param('gameId') gameId: number,
    @Body() body: { quantity: number; order_id: number },
  ) {
    this.logger.log(
      `Запрос на резервирование ключей для игры ${gameId}, количество: ${body.quantity}, заказ: ${body.order_id}`,
    );
    return this.gameKeysService.reserveKeys(
      gameId,
      body.quantity,
      body.order_id,
    );
  }

  @Post('confirm/:orderId')
  async confirmKeys(@Param('orderId') orderId: number) {
    this.logger.log(`Запрос на подтверждение ключей для заказа ${orderId}`);
    return this.gameKeysService.confirmKeys(orderId);
  }

  @Post('cancel/:orderId')
  async cancelReservation(@Param('orderId') orderId: number) {
    this.logger.log(`Запрос на отмену резервирования для заказа ${orderId}`);
    return this.gameKeysService.cancelReservation(orderId);
  }

  @Get('order/:orderId')
  async getOrderKeys(@Param('orderId') orderId: number) {
    this.logger.log(`Запрос на получение ключей для заказа ${orderId}`);
    return this.gameKeysService.getOrderKeys(orderId);
  }
}
