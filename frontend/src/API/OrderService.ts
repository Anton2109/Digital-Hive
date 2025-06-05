import { API_ENDPOINTS } from "./endpoints";
import { API_URL } from "@/constants";
import axios from "axios";

const baseUrl = API_URL;

export interface ICreateOrder {
  sessionId: string;
  email: string;
}

export interface IOrder {
  id: number;
  email: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export default class OrderService {
  static async createOrder(data: ICreateOrder): Promise<IOrder | null> {
    try {
      const response = await axios.post<IOrder>(
        `${baseUrl}${API_ENDPOINTS.ORDERS}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      throw error;
    }
  }

  static async confirmOrder(orderId: number): Promise<void> {
    try {
      await axios.post(`${baseUrl}${API_ENDPOINTS.CONFIRM_ORDER(orderId)}`);
    } catch (error) {
      console.error("Ошибка при подтверждении заказа:", error);
      throw error;
    }
  }
} 