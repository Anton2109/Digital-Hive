import { API_ENDPOINTS } from "./endpoints";
import axios from "axios";
import { IBasketItem, IAddBasketItem } from "@/interfaces/basket";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default class BasketService {
  static async getBasket(sessionId: string): Promise<IBasketItem[]> {
    try {
      const response = await axios.get<IBasketItem[]>(
        `${API_URL}${API_ENDPOINTS.BASKET}`,
        { params: { session_id: sessionId } }
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении корзины:", error);
      return [];
    }
  }

  static async addItem(item: IAddBasketItem): Promise<IBasketItem | null> {
    try {
      const response = await axios.post<IBasketItem>(
        `${API_URL}${API_ENDPOINTS.BASKET}`,
        item
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      return null;
    }
  }

  static async removeItem(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}${API_ENDPOINTS.BASKET}/${id}`);
      return true;
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
      return false;
    }
  }

  static async clearBasket(sessionId: string): Promise<void> {
    await axios.delete(`${API_URL}/basket/${sessionId}`);
  }
}
