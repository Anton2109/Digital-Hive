import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameKey } from './entities/game-key.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Game } from '../games/entities/game.entity';

@Injectable()
export class GameKeysService {
  constructor(
    @InjectRepository(GameKey)
    private gameKeysRepository: Repository<GameKey>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private readonly httpService: HttpService,
  ) {}

  async reserveKeys(gameId: number, quantity: number, orderId: number): Promise<GameKey[]> {
    return this.gameKeysRepository.manager.transaction(async (manager) => {
      const existingReservations = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.order_id = :orderId', { orderId })
        .getMany();

      if (existingReservations.length > 0) {
        return existingReservations;
      }

      const availableKeys = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.game_id = :gameId', { gameId })
        .andWhere('key.status = :status', { status: 'available' })
        .take(quantity)
        .getMany();

      if (availableKeys.length < quantity) {
        throw new Error(`Not enough keys available for game ${gameId}`);
      }

      const keysToReserve = availableKeys.map(key => ({
        ...key,
        status: 'reserved',
        order_id: orderId
      }));

      return manager.save(GameKey, keysToReserve);
    });
  }

  async confirmKeys(orderId: number): Promise<void> {
    return this.gameKeysRepository.manager.transaction(async (manager) => {
      const reservedKeys = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.status = :status', { status: 'reserved' })
        .andWhere('key.order_id = :orderId', { orderId })
        .getMany();

      if (reservedKeys.length === 0) {
        throw new NotFoundException(`No reserved keys found for order ${orderId}`);
      }

      const keysToConfirm = reservedKeys.map(key => ({
        ...key,
        status: 'used',
        used_at: new Date(),
        order_id: orderId
      }));

      await manager.save(GameKey, keysToConfirm);
    });
  }

  async cancelReservation(orderId: number): Promise<void> {
    return this.gameKeysRepository.manager.transaction(async (manager) => {
      const reservedKeys = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.status = :status', { status: 'reserved' })
        .andWhere('key.order_id = :orderId', { orderId })
        .getMany();

      if (reservedKeys.length === 0) {
        return;
      }

      const keysToRelease = reservedKeys.map(key => ({
        ...key,
        status: 'available',
        order_id: null
      }));

      await manager.save(GameKey, keysToRelease);
    });
  }

  async getOrderKeys(orderId: number) {
    const keys = await this.gameKeysRepository
      .createQueryBuilder('key')
      .leftJoinAndSelect('key.game', 'game')
      .where('key.order_id = :orderId', { orderId })
      .getMany();

    if (!keys.length) {
      throw new NotFoundException(`Ключи для заказа ${orderId} не найдены`);
    }

    return keys.map(key => ({
      gameName: key.game.name,
      key: key.key
    }));
  }
} 