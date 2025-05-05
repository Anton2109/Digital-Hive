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
import { CreateGameDto } from './dto/create-game.dto';
import { pathsConfig } from '../config/paths.config';

@Injectable()
export class GamesService {
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
  ) {}

  private formatGameImagePath(imgPath: string): string {
    return `${pathsConfig.baseUrl}/assets/images/games/${imgPath}`;
  }

  async findAll(): Promise<Game[]> {
    const games = await this.gameRepository.find({
      relations: ['gameInfo', 'systemReqMin', 'systemReqMax', 'categories'],
    });

    return games.map(game => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo ? {
        ...game.gameInfo,
        img: this.formatGameImagePath(game.gameInfo.img)
      } : null
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
      game.gameInfo = await this.gameInfoRepository.findOne({ where: { game_id: id } });
    }
    if (!game.systemReqMin) {
      game.systemReqMin = await this.systemReqMinRepository.findOne({ where: { game_id: id } });
    }
    if (!game.systemReqMax) {
      game.systemReqMax = await this.systemReqMaxRepository.findOne({ where: { game_id: id } });
    }

    return {
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo ? {
        ...game.gameInfo,
        img: this.formatGameImagePath(game.gameInfo.img)
      } : null
    };
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    // Создаем игру
    const game = this.gameRepository.create({
      name: createGameDto.name,
      img_path: createGameDto.img_path,
      price: createGameDto.price,
    });
    const savedGame = await this.gameRepository.save(game);

    // Создаем информацию об игре
    if (createGameDto.gameInfo) {
      const gameInfo = this.gameInfoRepository.create({
        ...createGameDto.gameInfo,
        game_id: savedGame.id,
      });
      await this.gameInfoRepository.save(gameInfo);
    }

    // Создаем минимальные требования
    if (createGameDto.minimumRequirements) {
      const minReq = this.systemReqMinRepository.create({
        ...createGameDto.minimumRequirements,
        game_id: savedGame.id,
      });
      await this.systemReqMinRepository.save(minReq);
    }

    // Создаем рекомендуемые требования
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
    const game = await this.findOne(id);
    await this.gameRepository.remove(game);
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

    return games.map(game => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo ? {
        ...game.gameInfo,
        img: this.formatGameImagePath(game.gameInfo.img)
      } : null
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

    return games.map(game => ({
      ...game,
      img_path: this.formatGameImagePath(game.img_path),
      gameInfo: game.gameInfo ? {
        ...game.gameInfo,
        img: this.formatGameImagePath(game.gameInfo.img)
      } : null
    }));
  }
} 