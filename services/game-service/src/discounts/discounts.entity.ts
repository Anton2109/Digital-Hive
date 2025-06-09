import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from '../games/entities/game.entity';

@Entity('game_discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game_id: number;

  @Column()
  discount_percent: number;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
