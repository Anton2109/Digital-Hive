import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import AuthService from '@/API/AuthService';
import { IUserProfile } from '@/interfaces/user';

interface Purchase {
  id: number;
  gameName: string;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const mockPurchases: Purchase[] = [
  {
    id: 1,
    gameName: 'Cyberpunk 2077',
    price: 1999,
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 2,
    gameName: 'The Witcher 3',
    price: 999,
    date: '2024-03-10',
    status: 'completed'
  },
  {
    id: 3,
    gameName: 'Red Dead Redemption 2',
    price: 2499,
    date: '2024-03-05',
    status: 'pending'
  }
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isFetching) return;
      
      setIsFetching(true);
      setLoading(true);
      setError(null);
      
      try {
        const data = await AuthService.getProfile();
        setProfile(data);
      } catch (error) {
        console.log("Ошибка при выходе из системы", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setProfile(null);
    } catch (error) {
      console.log("Ошибка при выходе из системы", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.notAuth}>
          <h2>Для доступа к профилю необходимо авторизоваться</h2>
          <button 
            onClick={() => navigate('/auth/login')} 
            className={styles.authButton}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileLayout}>
        <div className={styles.profileCard}>
          <h2 className={styles.title}>Профиль</h2>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{profile.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Имя:</span>
              <span className={styles.value}>{profile.username}</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>

        <div className={styles.purchasesCard}>
          <h2 className={styles.title}>История покупок</h2>
          <div className={styles.purchasesList}>
            {mockPurchases.map((purchase) => (
              <div key={purchase.id} className={styles.purchaseItem}>
                <div className={styles.purchaseInfo}>
                  <h3 className={styles.gameName}>{purchase.gameName}</h3>
                  <div className={styles.purchaseDetails}>
                    <span className={styles.price}>{purchase.price} ₽</span>
                    <span className={styles.date}>{purchase.date}</span>
                    <span className={`${styles.status} ${styles[purchase.status]}`}>
                      {purchase.status === 'completed' && 'Выполнено'}
                      {purchase.status === 'pending' && 'В обработке'}
                      {purchase.status === 'cancelled' && 'Отменено'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 