<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import AuthService from "@/API/AuthService";
import { IAuthForm } from "@/interfaces/authForm";

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IAuthForm>({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    try {
      setIsLoading(true);
      const data = mode === "login" 
        ? await AuthService.login(formData)
        : await AuthService.register(formData);
      
      if (mode === "login") {
        localStorage.setItem("token", data.access_token);
        navigate("/");
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setError("Не удалось выполнить авторизацию");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: IAuthForm) => ({ ...prev, [name]: value }));
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

        <button type="submit" className={styles.submitButton}>
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
=======
import styles from "./AuthForm.module.css";

const AuthForm = () => {
  return <div className={styles.container}></div>;
>>>>>>> 62fe03f665779e0b10bed12214d10c77982b9400
};

export default AuthForm;
