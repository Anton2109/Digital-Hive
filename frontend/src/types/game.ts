export interface IGame {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  img: string;
  releaseDate?: string;
  genres?: string;
  developer?: string;
}

export interface FeaturedGame extends IGame {
  featured: true;
} 