import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { GameKey } from '../../game-keys/entities/game-key.entity';

@Entity('user_games')
export class UserGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  email: string;

  @Index()
  @Column()
  game_id: number;

  @Index()
  @Column()
  key_id: number;

  @CreateDateColumn()
  purchase_date: Date;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => GameKey)
  @JoinColumn({ name: 'key_id' })
  key: GameKey;
} 