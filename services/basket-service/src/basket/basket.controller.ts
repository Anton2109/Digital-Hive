import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { BasketService } from './basket.service';

@Controller('cart')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  getCart(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      return { error: 'session_id query parameter is required' };
    }
    return this.basketService.getCart(sessionId);
  }

  @Post()
  addToCart(
    @Body() body: { session_id: string; game_id: number; quantity?: number },
  ) {
    const { session_id, game_id, quantity } = body;
    if (!session_id || !game_id) {
      return { error: 'session_id and game_id are required' };
    }
    return this.basketService.addItem(session_id, game_id, quantity || 1);
  }

  @Delete(':id')
  removeItem(@Param('id') id: number) {
    return this.basketService.removeItem(id);
  }
}
