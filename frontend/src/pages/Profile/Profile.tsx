import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, setUser } from "../../store/slices/authSlice";
import { IUserGame } from "@/interfaces/game";
import AuthService from "../../API/AuthService";
import GameService from "../../API/GameService";
import styles from "./Profile.module.css";
import { LogoutOutlined, UserOutlined, CrownOutlined } from "@ant-design/icons";
import { IMAGES_URL } from "../../constants";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<IUserGame[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

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
      navigate("/auth/login");
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert("Ошибка при выходе из системы");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <UserOutlined className={styles.userIcon} />
          <h2 className={styles.username}>
            {user?.username || "Пользователь"}
          </h2>
          {user?.role === "admin" && (
            <CrownOutlined className={styles.adminIcon} title="Администратор" />
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.email}>{user?.email}</span>
          <span className={styles.role}>
            {user?.role === "admin" ? "Администратор" : "Пользователь"}
          </span>
        </div>

        <div className={styles.buttons}>
          {user?.role === "admin" && (
            <button
              className={styles.adminButton}
              onClick={() => {
                console.log('Переход в админ-панель');
                navigate('/admin');
              }}
            >
              Админ-панель
            </button>
          )}
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogoutOutlined /> Выйти
          </button>
        </div>
      </div>

      {games.length > 0 ? (
        <div className={styles.gamesCard}>
          <h3 className={styles.gamesTitle}>
            Купленные игры
          </h3>
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
                  <h4 className={styles.gameTitle}>
                    {game.game.name}
                  </h4>
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
        </div>
      ) : (
        <div className={styles.gamesCard}>
          <div className={styles.emptyState}>
            <p>У вас пока нет купленных игр</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
