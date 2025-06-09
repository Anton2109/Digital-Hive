import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('user_games')
export class UserGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  game_id: number;

  @Column({ name: 'purchase_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchased_at: Date;

  @Column()
  key_id: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
} 