export interface IGame {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  img: string;
  releaseDate?: string;
  categories?: string;
  developer?: string;
}

export interface FeaturedGame extends IGame {
  featured: true;
}

export interface ISystemReq {
  windows: number;
  processor: string;
  RAM: number;
  graphicsCard: string;
  DirectX: number;
  DiskSpace: string;
}

export interface ISystemRequirementsProps {
  title: string;
  requirements: ISystemReq;
}

export interface IGameCard extends IGame {
  description: string;
  windows: number;
  processor: string;
  RAM: number;
  graphicsCard: string;
  DirectX: number;
  DiskSpace: string;
  info: {
    description: string;
    img: string;
  };
  systemRequirements: {
    minimum: ISystemReq;
    recommended: ISystemReq;
  };
}