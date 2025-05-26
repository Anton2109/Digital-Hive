import { API_ENDPOINTS } from "./endpoints";
import { API_URL } from "@/constants";
import axios from "axios";
import { IAuthForm } from "@/interfaces/authForm";
import { IUserProfile } from '@/interfaces/user';

const baseUrl = API_URL;

export default class AuthService {
  private static cachedProfile: IUserProfile | null = null;

  static async login(data: IAuthForm) {
    try {
      const url = `${baseUrl}${API_ENDPOINTS.AUTH_LOGIN}`;
      const response = await axios.post(url, data);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        this.cachedProfile = null;
      }
      return response.data;
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  }

  static async register(data: IAuthForm) {
    try {
      const url = `${baseUrl}${API_ENDPOINTS.AUTH_REGISTER}`;
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const url = `${baseUrl}${API_ENDPOINTS.AUTH_LOGOUT}`;
      await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      this.cachedProfile = null;
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      throw error;
    }
  }

  static async refresh() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const url = `${baseUrl}${API_ENDPOINTS.AUTH_REFRESH}`;
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      throw error;
    }
  }

  static async getProfile(): Promise<IUserProfile> {
    if (this.cachedProfile) {
      return this.cachedProfile;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    try {
      const response = await axios.get(`${baseUrl}${API_ENDPOINTS.AUTH_PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      });

      if (!response.data && this.cachedProfile) {
        return this.cachedProfile;
      }

      if (!response.data) {
        throw new Error('Данные профиля не получены');
      }

      const { id, email, username } = response.data;

      if (!id || !email || !username) {
        throw new Error('Данные профиля не получены');
      }

      this.cachedProfile = { id, email, username };
      return this.cachedProfile;
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      throw error;
    }
  }
}