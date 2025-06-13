import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { SystemReqMin } from './entities/system-req-min.entity';
import { SystemReqMax } from './entities/system-req-max.entity';
import { GameInfo } from './entities/game-info.entity';
import { Category } from './entities/category.entity';
import { UserGame } from './entities/user-game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { pathsConfig } from '../config/paths.config';
import { Logger } from '@nestjs/common';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(SystemReqMin)
    private readonly systemReqMinRepository: Repository<SystemReqMin>,
    @InjectRepository(SystemReqMax)
    private readonly systemReqMaxRepository: Repository<SystemReqMax>,
    @InjectRepository(GameInfo)
    private readonly gameInfoRepository: Repository<GameInfo>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
  ) {}

  private formatGameImagePath(imgPath: string): string {
    return `${pathsConfig.baseUrl}/assets/images/games/${imgPath}`;
  }

  async findAll(): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: ['gameInfo', 'systemReqMin', 'systemReqMax', 'categories'],
    });

    return games.map((game) => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo
        ? {
            ...game.gameInfo,
            img: this.formatGameImagePath(game.gameInfo.img),
          }
        : null,
    }));
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Game> {
    if (isNaN(id)) {
      throw new BadRequestException(`Некорректный ID игры: ${id}`);
    }

    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['gameInfo', 'systemReqMin', 'systemReqMax', 'categories'],
    });

    if (!game) {
      throw new NotFoundException(`Игра с id: ${id} не найдена`);
    }

    if (!game.gameInfo) {
      game.gameInfo = await this.gameInfoRepository.findOne({
        where: { game_id: id },
      });
    }
    if (!game.systemReqMin) {
      game.systemReqMin = await this.systemReqMinRepository.findOne({
        where: { game_id: id },
      });
    }
    if (!game.systemReqMax) {
      game.systemReqMax = await this.systemReqMaxRepository.findOne({
        where: { game_id: id },
      });
    }

    return {
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo
        ? {
            ...game.gameInfo,
            img: this.formatGameImagePath(game.gameInfo.img),
          }
        : null,
    };
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const game = this.gameRepository.create({
      name: createGameDto.name,
      price: createGameDto.price,
      img_path: createGameDto.img_path.split('/').pop(),
    });
    const savedGame = await this.gameRepository.save(game);

    if (createGameDto.gameInfo) {
      const gameInfo = this.gameInfoRepository.create({
        ...createGameDto.gameInfo,
        game_id: savedGame.id,
      });
      await this.gameInfoRepository.save(gameInfo);
    }

    if (createGameDto.minimumRequirements) {
      const minReq = this.systemReqMinRepository.create({
        ...createGameDto.minimumRequirements,
        game_id: savedGame.id,
      });
      await this.systemReqMinRepository.save(minReq);
    }

    if (createGameDto.recommendedRequirements) {
      const maxReq = this.systemReqMaxRepository.create({
        ...createGameDto.recommendedRequirements,
        game_id: savedGame.id,
      });
      await this.systemReqMaxRepository.save(maxReq);
    }

    return this.findOne(savedGame.id);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Попытка удаления игры с ID: ${id}`);
    
    try {
      const game = await this.gameRepository.findOne({
        where: { id },
        relations: ['gameInfo', 'systemReqMin', 'systemReqMax', 'categories'],
      });

      if (!game) {
        throw new NotFoundException(`Игра с id: ${id} не найдена`);
      }
      
      this.logger.log(`Найдена игра для удаления: ${JSON.stringify(game)}`);
      
      await this.userGameRepository.delete({ game_id: id });
      
      if (game.gameInfo) {
        await this.gameInfoRepository.remove(game.gameInfo);
      }
      if (game.systemReqMin) {
        await this.systemReqMinRepository.remove(game.systemReqMin);
      }
      if (game.systemReqMax) {
        await this.systemReqMaxRepository.remove(game.systemReqMax);
      }
      
      if (game.categories && game.categories.length > 0) {
        await this.gameRepository
          .createQueryBuilder()
          .relation(Game, "categories")
          .of(game)
          .remove(game.categories);
      }
      
      await this.gameRepository.remove(game);
      
      this.logger.log(`Игра с ID ${id} успешно удалена`);
    } catch (error) {
      this.logger.error(`Ошибка при удалении игры с ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async search(query: string): Promise<Game[]> {
    const games = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.gameInfo', 'gameInfo')
      .leftJoinAndSelect('game.systemReqMin', 'systemReqMin')
      .leftJoinAndSelect('game.systemReqMax', 'systemReqMax')
      .leftJoinAndSelect('game.categories', 'categories')
      .where('LOWER(game.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();

    return games.map((game) => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo
        ? {
            ...game.gameInfo,
            img: this.formatGameImagePath(game.gameInfo.img),
          }
        : null,
    }));
  }

  async findByCategory(categoryId: number): Promise<Game[]> {
    const games = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.gameInfo', 'gameInfo')
      .leftJoinAndSelect('game.systemReqMin', 'systemReqMin')
      .leftJoinAndSelect('game.systemReqMax', 'systemReqMax')
      .leftJoinAndSelect('game.categories', 'categories')
      .where('categories.id = :categoryId', { categoryId })
      .getMany();

    return games.map((game) => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo
        ? {
            ...game.gameInfo,
            img: this.formatGameImagePath(game.gameInfo.img),
          }
        : null,
    }));
  }

  async getUserGames(email: string): Promise<Game[]> {
    const userGames = await this.userGameRepository.find({
      where: { email: email },
      relations: ['game', 'game.gameInfo', 'game.systemReqMin', 'game.systemReqMax', 'game.categories'],
    });

    return userGames.map((userGame) => ({
      ...userGame.game,
      img_path: this.formatGameImagePath(userGame.game.img_path),
      gameInfo: userGame.game.gameInfo
        ? {
            ...userGame.game.gameInfo,
            img: this.formatGameImagePath(userGame.game.gameInfo.img),
          }
        : null,
    }));
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id);

    if (updateGameDto.name) {
      game.name = updateGameDto.name;
    }
    if (updateGameDto.img_path) {
      const fileName = updateGameDto.img_path.split('/').pop();
      game.img_path = fileName;
    }
    if (updateGameDto.price) {
      game.price = updateGameDto.price;
    }

    await this.gameRepository.save(game);

    if (updateGameDto.gameInfo) {
      const existingGameInfo = await this.gameInfoRepository.findOne({
        where: { game_id: id },
      });

      if (existingGameInfo) {
        await this.gameInfoRepository.update(existingGameInfo.id, updateGameDto.gameInfo);
      } else {
        const gameInfo = this.gameInfoRepository.create({
          ...updateGameDto.gameInfo,
          game_id: id,
        });
        await this.gameInfoRepository.save(gameInfo);
      }
    }

    const existingMinReq = await this.systemReqMinRepository.findOne({
      where: { game_id: id },
    });

    if (updateGameDto.minimumRequirements && Object.keys(updateGameDto.minimumRequirements).length > 0) {
      if (existingMinReq) {
        await this.systemReqMinRepository.update(existingMinReq.id, updateGameDto.minimumRequirements);
      } else {
        const minReq = this.systemReqMinRepository.create({
          ...updateGameDto.minimumRequirements,
          game_id: id,
        });
        await this.systemReqMinRepository.save(minReq);
      }
    }

    const existingMaxReq = await this.systemReqMaxRepository.findOne({
      where: { game_id: id },
    });

    if (updateGameDto.recommendedRequirements && Object.keys(updateGameDto.recommendedRequirements).length > 0) {
      if (existingMaxReq) {
        await this.systemReqMaxRepository.update(existingMaxReq.id, updateGameDto.recommendedRequirements);
      } else {
        const maxReq = this.systemReqMaxRepository.create({
          ...updateGameDto.recommendedRequirements,
          game_id: id,
        });
        await this.systemReqMaxRepository.save(maxReq);
      }
    }

    return this.findOne(id);
  }
}
