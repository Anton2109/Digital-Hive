import axios from "axios";
import { API_URL } from "@/constants";
import { IUserProfile } from "../interfaces/user";

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

interface RegisterResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('AuthService: начало входа');
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });
    console.log('AuthService: ответ от сервера при входе:', response.data);
    return response.data;
  }

  async register(email: string, password: string, username: string): Promise<RegisterResponse> {
    try {
      console.log('AuthService: начало регистрации');
      const response = await axios.post<RegisterResponse>(`${API_URL}/auth/register`, {
        email,
        password,
        username,
      });
      console.log('AuthService: ответ от сервера при регистрации:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ошибка при регистрации. Пожалуйста, попробуйте позже.");
    }
  }

  async getProfile(): Promise<IUserProfile> {
    try {
      console.log('AuthService: начало получения профиля');
      const token = localStorage.getItem("token");
      console.log('AuthService: токен при получении профиля:', token);
      
      if (!token) {
        throw new Error("Токен не найден");
      }

      const response = await axios.get<IUserProfile>(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('AuthService: ответ от сервера при получении профиля:', response.data);

      if (!response.data) {
        console.error('AuthService: пустой ответ от сервера');
        throw new Error("Пустой ответ от сервера");
      }

      const userData = response.data;
      const requiredFields = ['id', 'email', 'username', 'role'];
      const missingFields = requiredFields.filter(field => !(field in userData));
      
      if (missingFields.length > 0) {
        console.error('AuthService: отсутствуют обязательные поля:', missingFields);
        throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
      }

      return userData;
    } catch (error: any) {
      console.error("Ошибка при получении профиля:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Сессия истекла");
      }
      
      if (error instanceof Error && error.message === "Токен не найден") {
        throw error;
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error("Не удалось загрузить профиль");
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      localStorage.removeItem("token");
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}

export default AuthService.getInstance();
