import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasketItem } from './entites/basket.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketItem)
    private readonly basketRepository: Repository<BasketItem>,
  ) {}

  async getCart(sessionId: string) {
    return this.basketRepository.find({ where: { session_id: sessionId } });
  }

  async addItem(sessionId: string, gameId: number, quantity = 1) {
    const existingItem = await this.basketRepository.findOne({
      where: { session_id: sessionId, game_id: gameId },
    });
    if (existingItem) {
      existingItem.quantity += quantity;
      return this.basketRepository.save(existingItem);
    } else {
      const newItem = this.basketRepository.create({
        session_id: sessionId,
        game_id: gameId,
        quantity,
      });
      return this.basketRepository.save(newItem);
    }
  }

  async removeItem(id: number) {
    return this.basketRepository.delete(id);
  }

  async updateQuantity(id: number, quantity: number) {
    const item = await this.basketRepository.findOne({ where: { id } });
    if (!item) {
      throw new Error('Item not found');
    }
    item.quantity = quantity;
    return this.basketRepository.save(item);
  }
}
