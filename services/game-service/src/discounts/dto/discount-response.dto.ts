import { Game } from '../../games/entities/game.entity';

export class DiscountResponseDto {
  id: number;
  game_id: number;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  game: {
    id: number;
    name: string;
    price: number;
    img_path: string;
  };
} 