import { API_ENDPOINTS } from "./endpoints";
import { API_URL } from "@/constants";
import axios from "axios";
import { IGame } from "@/interfaces/game";
import { ICategory } from "@/interfaces/category";

const baseUrl = API_URL;

export default class GameService {
  static async getGames(): Promise<IGame[]> {
    try {
      const response = await axios.get<IGame[]>(
        `${baseUrl}${API_ENDPOINTS.GAMES}`
      );
      return response.data;
    } catch (error) {
      console.error('[GameService] Ошибка при получении списка игр:', error);
      return [];
    }
  }

  static async getCategories(): Promise<ICategory[]> {
    try {
      const response = await axios.get<ICategory[]>(
        `${baseUrl}${API_ENDPOINTS.CATEGORIES}`
      );
      return response.data;
    } catch (error) {
      console.error('[GameService] Ошибка при получении списка категорий:', error);
      return [];
    }
  }

  static async getGameById(id: number): Promise<IGame | null> {
    try {
      const response = await axios.get<IGame>(
        `${baseUrl}${API_ENDPOINTS.GAME_BY_ID(id)}`
      );
      return response.data;
    } catch (error) {
      console.error(`[GameService] Ошибка при получении игры по id: ${id}:`, error);
      return null;
    }
  }

  static async getGamesByCategoryId(categoryId: number): Promise<IGame[]> {
    try {
      const response = await axios.get<IGame[]>(
        `${baseUrl}${API_ENDPOINTS.GAMES_BY_CATEGORY(categoryId)}`
      );
      return response.data;
    } catch (error) {
      console.error('[GameService] Ошибка при получении игр по категории:', error);
      return [];
    }
  }

  static async searchGames(query: string): Promise<IGame[]> {
    try {
      const response = await axios.get<IGame[]>(
        `${baseUrl}${API_ENDPOINTS.GAMES}`,
        {
          params: { name: query, limit: 10 },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[GameService] Ошибка при поиске игр:', error);
      return [];
    }
  }
}
