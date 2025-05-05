import styles from './Sales.module.css';
import GamesList from '../GamesList/GamesList';

const Sales = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Скидки</h1>
        <p className={styles.subtitle}>Сэкономьте до 70%</p>
        <p className={styles.description}>
          Не упустите возможность приобрести отличные игры по выгодным ценам.
          Предложение ограничено по времени!
        </p>
      </div>

      <div className={styles.grid}>
        <GamesList />
      </div>
    </div>
  );
};

export default Sales; 