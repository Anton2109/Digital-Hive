import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('game_info')
export class GameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game_id: number;

  @Column('text')
  description: string;

  @Column('date')
  release_date: Date;

  @Column()
  developer: string;

  @Column()
  publisher: string;

  @Column('decimal', { precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column()
  img: string;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
} 