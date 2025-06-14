import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameKey } from './entities/game-key.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Game } from '../games/entities/game.entity';
import { UserGamesService } from '../user-games/user-games.service';

@Injectable()
export class GameKeysService {
  private readonly logger = new Logger(GameKeysService.name);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 100;

  constructor(
    @InjectRepository(GameKey)
    private gameKeysRepository: Repository<GameKey>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private readonly httpService: HttpService,
    private readonly userGamesService: UserGamesService,
  ) {}

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(operation: () => Promise<T>, retries = this.MAX_RETRIES): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && error.message.includes('Lock wait timeout exceeded')) {
        this.logger.warn(`Lock timeout, retrying... (${this.MAX_RETRIES - retries + 1}/${this.MAX_RETRIES})`);
        this.logger.debug(`Error details: ${error.message}`);
        await this.sleep(this.RETRY_DELAY);
        return this.retryOperation(operation, retries - 1);
      }
      this.logger.error(`Operation failed after all retries: ${error.message}`);
      throw error;
    }
  }

  async reserveKeys(gameId: number, quantity: number, orderId: number): Promise<GameKey[]> {
    this.logger.log(`Резервирование ключей для игры ${gameId}, количество: ${quantity}, заказ: ${orderId}`);
    return this.gameKeysRepository.manager.transaction(async (manager) => {
      const existingReservations = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.order_id = :orderId', { orderId })
        .andWhere('key.game_id = :gameId', { gameId })
        .getMany();

      if (existingReservations.length > 0) {
        this.logger.log(`Найдены существующие резервации для заказа ${orderId} и игры ${gameId}: ${existingReservations.length} ключей`);
        return existingReservations;
      }

      const availableKeys = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.game_id = :gameId', { gameId })
        .andWhere('key.status = :status', { status: 'available' })
        .take(quantity)
        .getMany();

      this.logger.log(`Доступно ключей для игры ${gameId}: ${availableKeys.length}`);
      this.logger.log(`Список доступных ключей: ${JSON.stringify(availableKeys.map(k => k.key))}`);

      if (availableKeys.length < quantity) {
        this.logger.error(`Недостаточно ключей для игры ${gameId}. Доступно: ${availableKeys.length}, запрошено: ${quantity}`);
        throw new Error(`Not enough keys available for game ${gameId}`);
      }

      const keysToReserve = availableKeys.map(key => ({
        ...key,
        status: 'reserved',
        order_id: orderId
      }));

      this.logger.log(`Резервируем ключи: ${JSON.stringify(keysToReserve.map(k => k.key))}`);
      const saved = await manager.save(GameKey, keysToReserve);
      this.logger.log(`Ключи успешно зарезервированы: ${JSON.stringify(saved.map(k => k.key))}`);
      return saved;
    });
  }

  async confirmKeys(orderId: number, email: string): Promise<void> {
    this.logger.log(`Подтверждение ключей для заказа ${orderId} для email ${email}`);
    
    return this.retryOperation(async () => {
      return this.gameKeysRepository.manager.transaction(async (manager) => {
        this.logger.debug(`Начало транзакции для заказа ${orderId}`);
        
        const reservedKeys = await manager
          .createQueryBuilder(GameKey, 'key')
          .where('key.status = :status', { status: 'reserved' })
          .andWhere('key.order_id = :orderId', { orderId })
          .getMany();

        this.logger.debug(`Найдено зарезервированных ключей: ${reservedKeys.length}`);

        if (reservedKeys.length === 0) {
          this.logger.error(`Не найдены зарезервированные ключи для заказа ${orderId}`);
          throw new NotFoundException(`No reserved keys found for order ${orderId}`);
        }

        const keysToConfirm = reservedKeys.map(key => ({
          ...key,
          status: 'used',
          used_at: new Date(),
          order_id: orderId
        }));

        this.logger.log(`Подтверждение ${keysToConfirm.length} ключей для заказа ${orderId}`);
        this.logger.debug(`Ключи для подтверждения: ${JSON.stringify(keysToConfirm)}`);
        
        await manager.save(GameKey, keysToConfirm);
        this.logger.debug(`Ключи успешно сохранены в базе данных`);

        for (const key of keysToConfirm) {
          this.logger.debug(`Добавление игры ${key.game_id} для пользователя ${email}`);
          const userGame = manager.create('UserGame', {
            email: email,
            game_id: key.game_id,
            key_id: key.id,
          });
          await manager.save('UserGame', userGame);
          this.logger.debug(`Игра ${key.game_id} успешно добавлена для пользователя ${email}`);
        }

        this.logger.debug(`Транзакция успешно завершена для заказа ${orderId}`);
      });
    });
  }

  async cancelReservation(orderId: number): Promise<void> {
    this.logger.log(`Отмена резервирования для заказа ${orderId}`);
    return this.gameKeysRepository.manager.transaction(async (manager) => {
      const reservedKeys = await manager
        .createQueryBuilder(GameKey, 'key')
        .where('key.status = :status', { status: 'reserved' })
        .andWhere('key.order_id = :orderId', { orderId })
        .getMany();

      if (reservedKeys.length === 0) {
        this.logger.log(`Нет зарезервированных ключей для отмены для заказа ${orderId}`);
        return;
      }

      const keysToRelease = reservedKeys.map(key => ({
        ...key,
        status: 'available',
        order_id: null
      }));

      this.logger.log(`Отмена резервирования ${keysToRelease.length} ключей для заказа ${orderId}`);
      await manager.save(GameKey, keysToRelease);
    });
  }

  async getOrderKeys(orderId: number) {
    this.logger.log(`Получение ключей для заказа ${orderId}`);
    const keys = await this.gameKeysRepository
      .createQueryBuilder('key')
      .leftJoinAndSelect('key.game', 'game')
      .where('key.order_id = :orderId', { orderId })
      .getMany();

    if (!keys.length) {
      this.logger.error(`Ключи для заказа ${orderId} не найдены`);
      throw new NotFoundException(`Ключи для заказа ${orderId} не найдены`);
    }

    this.logger.log(`Получено ${keys.length} ключей для заказа ${orderId}`);
    return keys.map(key => ({
      gameName: key.game.name,
      key: key.key
    }));
  }
} 