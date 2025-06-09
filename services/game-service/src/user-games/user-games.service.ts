import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { UserGame } from './entities/user-game.entity';

@Injectable()
export class UserGamesService {
  private readonly logger = new Logger(UserGamesService.name);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 100;

  constructor(
    @InjectRepository(UserGame)
    private userGamesRepository: Repository<UserGame>,
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

  async addUserGame(email: string, gameId: number, keyId: number, manager?: EntityManager): Promise<UserGame> {
    this.logger.log(`Добавление игры ${gameId} для пользователя ${email}`);
    this.logger.debug(`Параметры: email=${email}, gameId=${gameId}, keyId=${keyId}`);
    
    const repository = manager ? manager.getRepository(UserGame) : this.userGamesRepository;
    
    const userGame = repository.create({
      email,
      game_id: gameId,
      key_id: keyId,
    });
    
    this.logger.debug(`Создан объект UserGame: ${JSON.stringify(userGame)}`);
    
    const savedGame = await repository.save(userGame);
    this.logger.debug(`Игра успешно сохранена в базе данных: ${JSON.stringify(savedGame)}`);
    
    return savedGame;
  }

  async getUserGames(email: string): Promise<UserGame[]> {
    this.logger.log(`Получение списка игр для пользователя ${email}`);
    
    try {
      const games = await this.userGamesRepository.find({
        where: { email },
        relations: ['game', 'key'],
      });
      
      this.logger.debug(`Найдено игр: ${games.length}`);
      this.logger.debug(`Список игр: ${JSON.stringify(games)}`);
      
      return games;
    } catch (error) {
      this.logger.error(`Ошибка при получении списка игр: ${error.message}`);
      this.logger.debug(`Детали ошибки: ${JSON.stringify(error)}`);
      throw error;
    }
  }
} 