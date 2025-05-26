import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity('game_keys')
export class GameKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game_id: number;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: ['available', 'used', 'reserved'],
    default: 'available'
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  used_at: Date;

  @Column({ nullable: true })
  order_id: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
} 