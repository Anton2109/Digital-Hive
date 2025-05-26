import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cart')
export class BasketItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_id: string;

  @Column()
  game_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  added_at: Date;
}
