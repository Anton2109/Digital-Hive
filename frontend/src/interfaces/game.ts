export interface IGame {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  img_path: string;
  releaseDate?: string;
  categories?: string;
  developer?: string;
}

export interface FeaturedGame extends IGame {
  featured: true;
}

export interface ISystemReq {
  windows: string;
  processor: string;
  RAM: string;
  graphicsCard: string;
  DirectX: string;
  DiskSpace: string;
}

export interface ISystemRequirementsProps {
  title: string;
  requirements: ISystemReq;
}

export interface IGameCard {
  id: number;
  name: string;
  img_path: string;
  price: number;
  gameInfo: {
    id: number;
    game_id: number;
    description: string;
    release_date: string;
    developer: string;
    publisher: string;
    rating: string;
    img: string;
  };
  systemReqMin: ISystemReq;
  systemReqMax: ISystemReq;
  categories: Array<{
    id: number;
    name: string;
    categoriesImg: string;
  }>;
}