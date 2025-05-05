import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { GameInfo } from './game-info.entity';
import { SystemReqMin } from './system-req-min.entity';
import { SystemReqMax } from './system-req-max.entity';
import { Category } from './category.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img_path: string;

  @Column()
  price: number;

  @OneToOne(() => GameInfo, gameInfo => gameInfo.game)
  @JoinColumn({ name: 'id', referencedColumnName: 'game_id' })
  gameInfo: GameInfo;

  @OneToOne(() => SystemReqMin, systemReqMin => systemReqMin.game)
  systemReqMin: SystemReqMin;

  @OneToOne(() => SystemReqMax, systemReqMax => systemReqMax.game)
  systemReqMax: SystemReqMax;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'game_genre',
    joinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categories_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];
} 