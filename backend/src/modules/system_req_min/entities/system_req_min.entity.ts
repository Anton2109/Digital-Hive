import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from '../../games/entities/games.entity';

@Entity('system_req_min')
export class SystemReqMin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2 })
  windows: string;

  @Column()
  processor: string;

  @Column({ length: 3 })
  RAM: string;

  @Column()
  graphicsCard: string;

  @Column({ length: 2 })
  DirectX: string;

  @Column({ length: 10 })
  DiskSpace: string;

  @Column({ name: 'game_id' })
  gameId: number;

  @ManyToOne(() => Game, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
