import { Category } from '../../categories/entities/categories.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Index
} from 'typeorm';

@Entity('games')
@Index(['name'], {fulltext:true})
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 255, name: 'img_path' })
  img: string;

  @Column()
  price: number;

  @ManyToMany(() => Category, (genre) => genre.games)
  @JoinTable({
    name: 'game_genre',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categories_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
}
