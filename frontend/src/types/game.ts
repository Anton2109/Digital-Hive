export interface IGame {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  img: string;
  releaseDate: string;
  rating?: number;
  genres?: string[];
  platforms?: string[];
  developer?: string;
  publisher?: string;
}

export interface FeaturedGame extends IGame {
  featured: true;
} 