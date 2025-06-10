import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, setUser } from "../../store/slices/authSlice";
import { IUserGame } from "@/interfaces/game";
import AuthService from "../../API/AuthService";
import GameService from "../../API/GameService";
import styles from "./Profile.module.css";
import { LogoutOutlined, UserOutlined, CrownOutlined, EditOutlined, InfoCircleOutlined, DashboardOutlined } from "@ant-design/icons";
import { IMAGES_URL } from "../../constants";
import { message } from "antd";
import { Button, Input } from "antd";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<IUserGame[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      console.log('Запрос профиля...');
      const profileData = await AuthService.getProfile();
      console.log('Полученные данные профиля:', profileData);
      
      if (profileData && profileData.id) {
        dispatch(setUser(profileData));
        await fetchUserGames(profileData.email);
      }
    } catch (error) {
      console.error('Ошибка при получении данных профиля:', error);
      if (retryCount < maxRetries) {
        console.log(`Повторная попытка ${retryCount + 1} из ${maxRetries}`);
        setRetryCount(prev => prev + 1);
        setTimeout(fetchProfile, 1000);
      } else {
        alert("Не удалось загрузить профиль");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGames = async (email: string) => {
    try {
      console.log('Запрос игр пользователя...');
      const userGames = await GameService.getUserGames(email);
      console.log('Полученные игры:', userGames);
      setGames(userGames);
    } catch (error) {
      console.error('Ошибка при получении игр:', error);
      alert("Не удалось загрузить игры пользователя");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    if (!user || !user.id) {
      fetchProfile();
    } else {
      fetchUserGames(user.email);
      setLoading(false);
    }
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      console.log('Начало процесса выхода...');
      await AuthService.logout();
      console.log('Выход выполнен успешно');
      dispatch(logout());
      navigate('/auth/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      message.error('Ошибка при выходе из системы');
    }
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleEditClick = () => {
    console.log('handleEditClick вызван');
    console.log('Текущее состояние isSubmitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('Форма заблокирована, выход из функции');
      return;
    }
    
    console.log('Установка данных формы');
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    console.log('Включение режима редактирования');
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleInputChange вызван');
    console.log('Текущее состояние isSubmitting:', isSubmitting);
    
    if (isSubmitting) {
      console.log('Форма заблокирована, выход из функции');
      return;
    }
    
    const { name, value } = e.target;
    console.log('Обновление поля:', name, 'значение:', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      console.log('Форма уже отправляется, игнорируем повторную отправку');
      return;
    }

    if (!formData.currentPassword) {
      message.error('Для сохранения изменений необходимо ввести текущий пароль');
      return;
    }

    try {
      console.log('Начало отправки формы:', {
        formData,
        isSubmitting,
        isEditing,
        loading
      });

      setIsSubmitting(true);
      
      // Проверяем пароли
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      console.log('Отправка запроса на обновление профиля:', {
        url: 'http://localhost:3000/auth/update-profile',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const response = await fetch('http://localhost:3000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Получен ответ от сервера:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const responseData = await response.json();
      console.log('Данные ответа:', responseData);

      if (!response.ok) {
        if (responseData.message === 'Current password is incorrect') {
          throw new Error('Неверный текущий пароль. Пожалуйста, проверьте введенный пароль');
        }
        throw new Error(responseData.message || 'Ошибка при обновлении профиля');
      }

      console.log('Профиль успешно обновлен:', responseData);
      
      dispatch(setUser(responseData));
      setIsEditing(false);
      setFormData({
        username: responseData.username,
        email: responseData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      message.success('Профиль успешно обновлен');
    } catch (error: any) {
      console.error('Ошибка при обновлении профиля:', {
        error,
        message: error.message,
        stack: error.stack
      });
      message.error(error.message || 'Ошибка при обновлении профиля');
    } finally {
      console.log('Завершение отправки формы:', {
        isSubmitting: false,
        isEditing,
        loading
      });
      setIsSubmitting(false);
    }
  };

  // Добавляем логирование при изменении состояния
  useEffect(() => {
    console.log('Состояние компонента изменилось:', {
      isEditing,
      isSubmitting,
      loading,
      user,
      formData
    });
  }, [isEditing, isSubmitting, loading, user, formData]);

  // Добавляем логирование при монтировании компонента
  useEffect(() => {
    console.log('Компонент профиля смонтирован');
    return () => {
      console.log('Компонент профиля размонтирован');
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  console.log('Текущее состояние компонента:', {
    isEditing,
    isSubmitting,
    loading,
    user: user?.username
  });

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Профиль</h1>
        <div className={styles.headerActions}>
          {user?.role === 'admin' && (
            <Button
              type="primary"
              icon={<DashboardOutlined />}
              onClick={handleAdminPanel}
              className={styles.adminButton}
            >
              Админ-панель
            </Button>
          )}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            disabled={isSubmitting}
          >
            Редактировать
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Выйти
          </Button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formNotice}>
            <InfoCircleOutlined /> Для сохранения изменений необходимо ввести текущий пароль
          </div>
          <div className={styles.formGroup}>
            <label>Имя пользователя:</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Текущий пароль:</label>
            <Input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Новый пароль (оставьте пустым, если не хотите менять):</label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Подтвердите новый пароль:</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formActions}>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Сохранить
            </Button>
            <Button onClick={() => setIsEditing(false)} disabled={isSubmitting}>
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.profileInfo}>
          <div className={styles.infoGroup}>
            <label>Имя пользователя</label>
            <span>{user?.username}</span>
          </div>
          <div className={styles.infoGroup}>
            <label>Email</label>
            <span>{user?.email}</span>
          </div>
        </div>
      )}

      <div className={styles.userGames}>
        <h2>Мои игры</h2>
        {loading ? (
          <div className={styles.loading}>Загрузка игр...</div>
        ) : games.length > 0 ? (
          <div className={styles.gamesGrid}>
            {games.map((game) => (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameImageContainer}>
                  <img
                    src={`${IMAGES_URL}/${game.game.img_path}`}
                    alt={game.game.name}
                    className={styles.gameImage}
                  />
                </div>
                <div className={styles.gameInfo}>
                  <h3>{game.game.name}</h3>
                  <div className={styles.gameDetails}>
                    <span className={styles.gamePrice}>{game.game.price} ₽</span>
                    <span className={styles.purchaseDate}>
                      {game.purchase_date ? new Date(game.purchase_date).toLocaleDateString('ru-RU') : 'Дата покупки неизвестна'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noGames}>
            У вас пока нет купленных игр
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
