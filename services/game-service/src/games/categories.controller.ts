import { Controller, Get, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAllCategories();
  }

  @Get(':id')
  findGamesByCategory(@Param('id') categoryId: string) {
    return this.gamesService.findByCategory(+categoryId);
  }
}