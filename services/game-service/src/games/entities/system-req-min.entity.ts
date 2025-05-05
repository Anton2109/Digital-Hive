import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

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

  @Column()
  game_id: number;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
} 