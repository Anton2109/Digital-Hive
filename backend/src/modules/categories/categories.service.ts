import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/categories.dto';
import { pathsConfig } from '../../config/paths.config';
import { Game } from '../games/entities/games.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories.map((category) => ({
      ...category,
      categoriesImg: `${pathsConfig.baseUrl}${pathsConfig.assets.images.categories}/${category.categoriesImg}`,
    }));
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['games'],
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }

    return {
      ...category,
      categoriesImg: `${pathsConfig.baseUrl}${pathsConfig.assets.images.categories}/${category.categoriesImg}`,
      games: category.games.map((game) => ({
        ...game,
        img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
      })),
    };
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findGamesByCategoryId(categoryId: number): Promise<Game[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['games'],
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${categoryId} не найдена`);
    }

    return category.games.map((game) => ({
      ...game,
      img: `${pathsConfig.baseUrl}${pathsConfig.assets.images.games}/${game.img}`,
    }));
  }
}
