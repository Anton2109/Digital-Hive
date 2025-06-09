import axios from 'axios';
import { API_URL } from '@/constants';

export interface OrderItem {
  gameId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  email: string;
  items: OrderItem[];
}

export interface Order {
  id: number;
  email: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface GameKey {
  gameName: string;
  key: string;
}

class OrderService {
  static async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await axios.post(`${API_URL}/orders`, data);
    return response.data;
  }

  static async confirmOrder(orderId: number): Promise<void> {
    await axios.post(`${API_URL}/orders/${orderId}/confirm`);
  }

  static async getOrderKeys(orderId: number): Promise<GameKey[]> {
    const response = await axios.get(`${API_URL}/orders/${orderId}/keys`);
    return response.data;
  }
}

export default OrderService; 