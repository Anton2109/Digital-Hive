import { API_ENDPOINTS } from "./endpoints";
import { API_URL } from "@/constants";
import axios from "axios";
import { IBasketItem, IAddBasketItem } from "@/interfaces/basket";

const baseUrl = API_URL;

export default class BasketService {
  static async getBasket(sessionId: string): Promise<IBasketItem[]> {
    try {
      const response = await axios.get<IBasketItem[]>(
        `${baseUrl}${API_ENDPOINTS.BASKET}`,
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
        `${baseUrl}${API_ENDPOINTS.BASKET}`,
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
      await axios.delete(`${baseUrl}${API_ENDPOINTS.BASKET}/${id}`);
      return true;
    } catch (error) {
      console.error("Ошибка при удалении из корзины:", error);
      return false;
    }
  }
}
