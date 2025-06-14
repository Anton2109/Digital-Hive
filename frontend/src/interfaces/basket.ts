import { IGame } from "./game";

export interface IBasketItem {
  id: number;
  session_id?: string;
  game_id: number;
  quantity: number;
  added_at?: string;
  game: IGame;
  price: number;
}

export interface IAddBasketItem {
  session_id: string;
  game_id: number;
  quantity?: number;
}
