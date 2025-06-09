import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./AuthForm.module.css";
import authService from "@/API/AuthService";
import { IAuthForm } from "@/interfaces/authForm";
import { setUser, setToken } from "@/store/slices/authSlice";

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
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<IAuthForm>({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Начало авторизации:', { mode, email: formData.email });
      
      const response = mode === "login"
        ? await authService.login(formData.email, formData.password)
        : await authService.register(formData.email, formData.password, formData.username);

      console.log('Ответ от сервера:', response);

      const token = response.access_token;
      
      console.log('Полученный токен:', token);
      console.log('Полный ответ:', JSON.stringify(response, null, 2));
      
      if (!token) {
        console.error('Токен отсутствует в ответе:', response);
        throw new Error(mode === "login" ? "Неверный email или пароль" : "Ошибка при регистрации");
      }

      dispatch(setToken(token));
      dispatch(setUser(response.user));

      if (mode === "login") {
        console.log('Перенаправление на профиль');
        await new Promise(resolve => setTimeout(resolve, 500));
        navigate("/user/profile");
      } else {
        console.log('Перенаправление на страницу входа');
        navigate("/auth/login");
      }
    } catch (error: any) {
      console.error("Ошибка авторизации:", error);
      console.error("Детали ошибки:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        response: error.response
      });

      let errorMessage = "Не удалось выполнить авторизацию";

      if (error.response?.status === 401) {
        errorMessage = "Неверный email или пароль";
      } else if (error.message.includes("Неверный email или пароль")) {
        errorMessage = "Неверный email или пароль";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (!error.response?.data && response?.access_token) {
        console.log('Получен пустой ответ, но токен есть. Пробуем еще раз...');
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retryResponse = mode === "login"
            ? await authService.login(formData.email, formData.password)
            : await authService.register(formData.email, formData.password, formData.username);
          
          if (retryResponse.access_token) {
            dispatch(setToken(retryResponse.access_token));
            dispatch(setUser(retryResponse.user));
            navigate("/user/profile");
            return;
          }
        } catch (retryError) {
          console.error("Ошибка при повторной попытке:", retryError);
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error) setError("");
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className={styles.input}
          />
        </div>

        {mode === "register" && (
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Имя пользователя"
              required
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>

        <div className={styles.switchMode}>
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/register")}
                className={styles.switchButton}
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className={styles.switchButton}
              >
                Войти
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
