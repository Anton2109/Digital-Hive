import { GameInfo } from '../../game-info/entities/game-info.entity';
import { SystemReqMin } from '../../system_req_min/entities/system_req_min.entity';
import { SystemReqMax } from '../../system_req_max/entities/system_req_max.entity';
import { Category } from '../../categories/entities/categories.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinTable,
  Index,
} from 'typeorm';

@Entity('games')
@Index(['name'], { fulltext: true })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 255, name: 'img_path' })
  img: string;

  @Column()
  price: number;

  @ManyToMany(() => Category, (genre) => genre.games)
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

  @OneToOne(() => GameInfo, (gameInfo) => gameInfo.game)
  gameInfo: GameInfo;

  @OneToOne(() => SystemReqMin, (minReq) => minReq.game)
  minRequirements: SystemReqMin;

  @OneToOne(() => SystemReqMax, (maxReq) => maxReq.game)
  maxRequirements: SystemReqMax;
}
