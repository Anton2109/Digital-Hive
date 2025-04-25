import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/games.entity';
import { pathsConfig } from '../../config/paths.config';
import { SystemReqMin } from '../system_req_min/entities/system_req_min.entity';
import { SystemReqMax } from '../system_req_max/entities/system_req_max.entity';
import { GameWithRequirementsDto } from '../../common/dto/game-with-requirements.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(SystemReqMin)
    private readonly systemReqMinRepository: Repository<SystemReqMin>,
    @InjectRepository(SystemReqMax)
    private readonly systemReqMaxRepository: Repository<SystemReqMax>,
  ) {}

  async findAll(): Promise<Game[]> {
    const games = await this.gameRepository.find();
    return games.map((game) => ({
      ...game,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
    }));
  }

  async findOne(id: number): Promise<Game> {
    if (isNaN(id)) {
      throw new BadRequestException(`Некорректный ID игры: ${id}`);
    }

    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!game) {
      throw new NotFoundException(`Игра с id: ${id} не найдена`);
    }

    return {
      ...game,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
    };
  }

  async create(createGameDto: GameWithRequirementsDto): Promise<Game> {
    const newGame = new Game();
    Object.assign(newGame, {
      name: createGameDto.name,
      img: createGameDto.img,
      price: createGameDto.price,
    });
    const game = await this.gameRepository.save(newGame);

    const minReq = new SystemReqMin();
    Object.assign(minReq, {
      ...createGameDto.minimumRequirements,
      gameId: game.id,
    });
    await this.systemReqMinRepository.save(minReq);

    const maxReq = new SystemReqMax();
    Object.assign(maxReq, {
      ...createGameDto.recommendedRequirements,
      gameId: game.id,
    });
    await this.systemReqMaxRepository.save(maxReq);

    return this.findOne(game.id);
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepository.remove(game);
  }

  async search(query: string): Promise<Game[]> {
    const games = await this.gameRepository
      .createQueryBuilder('game')
      .where('LOWER(game.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();
  
    return games.map((game) => ({
      ...game,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
    }));
  }
}
