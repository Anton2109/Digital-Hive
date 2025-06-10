import { API_ENDPOINTS } from "./endpoints";
import axios from "axios";
import { ICategory } from "@/interfaces/category";
import { API_URL } from "@/constants";

export interface Game {
  id: number;
  name: string;
  img_path: string;
  price: number;
  gameInfo?: {
    description: string;
    release_date: string;
    developer: string;
    publisher: string;
    img: string;
    systemReqMin: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    systemReqMax: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };
}

export interface UserGame {
  id: number;
  email: string;
  game_id: number;
  key_id: number;
  purchase_date: string;
  game: Game;
  key: {
    id: number;
    game_id: number;
    key: string;
    status: string;
    used_at: string;
    order_id: number;
  };
}

export interface IGame extends Game {
  gameInfo: NonNullable<Game["gameInfo"]>;
}

export interface Category {
  id: number;
  name: string;
}

export interface IUserGame {
  id: number;
  email: string;
  game_id: number;
  key_id: number;
  purchase_date: string;
  game: IGame;
}

class GameService {
  async getGames(): Promise<IGame[]> {
    const response = await axios.get(`${API_URL}/games`);
    return response.data;
  }

  async getGameById(id: number): Promise<IGame> {
    const response = await axios.get(`${API_URL}/games/${id}`);
    return response.data;
  }

  async getCategories(): Promise<ICategory[]> {
    const response = await axios.get<ICategory[]>(
      `${API_URL}${API_ENDPOINTS.CATEGORIES}`
    );
    return response.data;
  }

  async getGamesByCategoryId(categoryId: number): Promise<IGame[]> {
    const response = await axios.get<IGame[]>(
      `${API_URL}${API_ENDPOINTS.GAMES_BY_CATEGORY(categoryId)}`
    );
    return response.data;
  }

  async searchGames(query: string): Promise<IGame[]> {
    const response = await axios.get<IGame[]>(
      `${API_URL}${API_ENDPOINTS.GAMES}`,
      {
        params: { name: query, limit: 10 },
      }
    );
    return response.data;
  }

  async getUserGames(email?: string): Promise<IUserGame[]> {
    if (email) {
      const response = await axios.get(`${API_URL}/user-games/${email}`);
      return response.data;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.get(`${API_URL}/games/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  async createGame(gameData: Omit<Game, 'id'>): Promise<IGame> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.post(`${API_URL}/games`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateGame(id: number, gameData: Partial<Game>): Promise<IGame> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    const response = await axios.put(`${API_URL}/games/${id}`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async deleteGame(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    console.log('Отправка запроса на удаление игры:', `${API_URL}/games/${id}`);
    console.log('Заголовки:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    await axios.delete(`${API_URL}/games/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}

export default new GameService();
