export interface IGameBase {
  id: number;
  name: string;
  price: number;
  img_path: string;
  categories?: IGameCategory[];
}

export interface IGameCategory {
  id: number;
  name: string;
  categoriesImg: string;
}

export interface IGameInfo {
  id: number;
  game_id: number;
  description: string;
  release_date: string;
  developer: string;
  publisher: string;
  rating: string;
  img: string;
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

export interface IGame extends IGameBase {
  gameInfo?: IGameInfo;
  systemReqMin?: ISystemReq;
  systemReqMax?: ISystemReq;
}

export interface FeaturedGame extends IGame {
  featured: true;
}

export interface IGameCard {
  id: number;
  name: string;
  img_path: string;
  price: number;
  gameInfo?: {
    id: number;
    game_id: number;
    description: string;
    release_date: string;
    developer: string;
    publisher: string;
    rating: string;
    img: string;
  };
  systemReqMin?: ISystemReq;
  systemReqMax?: ISystemReq;
  categories?: {
    id: number;
    name: string;
    categoriesImg: string;
  };
}

export interface IUserGame {
  id: number;
  email: string;
  game_id: number;
  key_id: number;
  purchase_date: string;
  game: IGame;
}
