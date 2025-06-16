import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, setUser } from "../../store/slices/authSlice";
import { IUserGame } from "@/interfaces/game";
import AuthService from "../../API/AuthService";
import GameService from "../../API/GameService";
import styles from "./Profile.module.css";
import { LogoutOutlined, UserOutlined, EditOutlined, DashboardOutlined } from "@ant-design/icons";
import { IMAGES_URL } from "../../constants";
import { message } from "antd";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<IUserGame[]>([]);
  const [visibleGames, setVisibleGames] = useState<IUserGame[]>([]);
  const [showAllGames, setShowAllGames] = useState(false);
  const gamesPerPage = 9;
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
      setGames(userGames as unknown as IUserGame[]);
      setVisibleGames(userGames.slice(0, gamesPerPage) as unknown as IUserGame[]);
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
    if (isSubmitting) return;
    
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.currentPassword) {
      message.error('Для сохранения изменений необходимо ввести текущий пароль');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      const response = await fetch('http://localhost:3000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.message === 'Current password is incorrect') {
          throw new Error('Неверный текущий пароль. Пожалуйста, проверьте введенный пароль');
        }
        throw new Error(responseData.message || 'Ошибка при обновлении профиля');
      }
      
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
      console.error('Ошибка при обновлении профиля:', error);
      message.error(error.message || 'Ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowAllGames = () => {
    if (showAllGames) {
      setVisibleGames(games.slice(0, gamesPerPage));
    } else {
      setVisibleGames(games);
    }
    setShowAllGames(!showAllGames);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.profileAvatar}>
            <UserOutlined />
          </div>
          <div className={styles.profileDetails}>
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {user?.role === 'admin' && (
            <button
              onClick={handleAdminPanel}
              className={styles.cyberButton}
            >
              <DashboardOutlined /> Админ-панель
            </button>
          )}
          <button
            onClick={handleEditClick}
            disabled={isSubmitting}
            className={styles.cyberButton}
          >
            <EditOutlined /> Редактировать
          </button>
          <button
            onClick={handleLogout}
            className={`${styles.cyberButton} ${styles.logoutButton}`}
          >
            <LogoutOutlined /> Выйти
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.warning}>
            Для изменения данных профиля необходимо ввести текущий пароль.
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Текущий пароль</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.input}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Новый пароль</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.input}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={styles.input}
              autoComplete="new-password"
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formActions}>
            <button type="submit" disabled={isSubmitting} className={styles.cyberButton}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} disabled={isSubmitting} className={styles.cyberButton}>
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.gamesSection}>
          <h2>Мои игры</h2>
          {loading ? (
            <div className={styles.loading}>Загрузка игр...</div>
          ) : games.length > 0 ? (
            <>
              <div className={styles.gamesGrid}>
                {visibleGames.map((userGame) => (
                  <div key={userGame.id} className={styles.gameCard}>
                    <div className={styles.gameImageContainer}>
                      <img
                        src={`${IMAGES_URL}/${userGame.game.img_path}`}
                        alt={userGame.game.name}
                        className={styles.gameImage}
                      />
                    </div>
                    <div className={styles.gameInfo}>
                      <h3>{userGame.game.name}</h3>
                      <div className={styles.gameDetails}>
                        <span className={styles.gamePrice}>{userGame.game.price} ₽</span>
                        <span className={styles.purchaseDate}>
                          {userGame.purchase_date ? new Date(userGame.purchase_date).toLocaleDateString('ru-RU') : 'Дата покупки неизвестна'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {games.length > gamesPerPage && (
                <button 
                  onClick={toggleShowAllGames}
                  className={styles.cyberButton}
                >
                  {showAllGames ? 'Показать меньше' : 'Показать еще'}
                </button>
              )}
            </>
          ) : (
            <div className={styles.noGames}>
              У вас пока нет купленных игр
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
  