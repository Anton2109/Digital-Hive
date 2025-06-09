import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('system_req_min')
export class SystemReqMin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2, nullable: true })
  windows: string;

  @Column({ nullable: true })
  processor: string;

  @Column({ length: 3, nullable: true })
  RAM: string;

  @Column({ nullable: true })
  graphicsCard: string;

  @Column({ length: 2, nullable: true })
  DirectX: string;

  @Column({ length: 10, nullable: true })
  DiskSpace: string;

  @Column()
  game_id: number;

  @OneToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
} 