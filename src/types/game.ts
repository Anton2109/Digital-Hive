export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  image: string;
  releaseDate: string;
  rating?: number;
  genres?: string[];
  platforms?: string[];
  developer?: string;
  publisher?: string;
}

export interface FeaturedGame extends Game {
  featured: true;
} 