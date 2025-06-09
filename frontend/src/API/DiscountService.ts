import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { API_URL } from '@/constants';

export interface IDiscount {
  id: number;
  game_id: number;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  game: {
    id: number;
    name: string;
    price: number;
    img_path: string;
  };
}

class DiscountService {
  async getDiscounts() {
    const response = await axios.get(`${API_URL}${API_ENDPOINTS.DISCOUNTS}`);
    return response.data;
  }

  async createDiscount(discountData: Omit<IDiscount, 'id' | 'game'>) {
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.DISCOUNTS}`, discountData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  async updateDiscount(id: number, discountData: Partial<IDiscount>) {
    const response = await axios.patch(`${API_URL}${API_ENDPOINTS.DISCOUNT_BY_ID(id)}`, discountData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }

  async deleteDiscount(id: number) {
    const response = await axios.delete(`${API_URL}${API_ENDPOINTS.DISCOUNT_BY_ID(id)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  }
}

export default new DiscountService(); 