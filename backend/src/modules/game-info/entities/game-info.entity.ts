import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from '../../games/entities/games.entity';

@Entity('game_info')
export class GameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img: string;

  @Column({ length: 1100 })
  description: string;

  @Column({ name: 'game_id' })
  gameId: number;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
