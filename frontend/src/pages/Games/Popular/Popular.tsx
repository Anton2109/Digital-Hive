import styles from './Popular.module.css';
import GamesList from '../GamesList/GamesList';

const Popular = () => {

  const stats = [
    { value: '10M+', label: 'Активных игроков' },
    { value: '4.8', label: 'Средний рейтинг' },
    { value: '250K+', label: 'Отзывов' },
    { value: '98%', label: 'Положительных оценок' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Популярные игры</h1>
        <p className={styles.description}>
          Откройте для себя игры, которые покорили сердца миллионов игроков по всему миру
        </p>
      </div>

      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <GamesList />
      </div>
    </div>
  );
};

export default Popular; 