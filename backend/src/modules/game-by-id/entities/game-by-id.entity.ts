import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('game_by_id')
export class GameById {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  img: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  windows: number;

  @Column()
  processor: string;

  @Column()
  RAM: number;

  @Column()
  graphicsCard: string;

  @Column()
  DirectX: number;

  @Column()
  DiskSpace: string;
}
