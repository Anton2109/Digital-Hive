import { Game } from '../../games/entities/games.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  categoriesImg: string;

  @ManyToMany(() => Game, (game) => game.categories)
  games: Game[];
}
