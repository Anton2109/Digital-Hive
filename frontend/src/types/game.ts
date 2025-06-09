export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface GameKey {
  gameName: string;
  key: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
} 