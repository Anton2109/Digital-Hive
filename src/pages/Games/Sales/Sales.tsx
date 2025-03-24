import { useState } from 'react';
import styles from './Sales.module.css';
import GameGrid from '../components/GameGrid';
import GameFilters from '../components/GameFilters';

interface Game {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  genre: string[];
  discount: number;
}

const Sales = () => {
  const [games] = useState<Game[]>([
    {
      id: '1',
      title: 'Cyberpunk 2077',
      price: 59.99,
      imageUrl: 'https://placehold.co/600x400',
      genre: ['RPG', 'Action'],
      discount: 20
    },
    {
      id: '2',
      title: 'Red Dead Redemption 2',
      price: 49.99,
      imageUrl: 'https://placehold.co/600x400',
      genre: ['Action', 'Adventure'],
      discount: 30
    },
  ]);

  const handleFilterChange = (filters: any) => {
    console.log('Фильтры:', filters);
  };

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

      <div className={styles.filters}>
        <GameFilters onFilterChange={handleFilterChange} />
      </div>

      <div className={styles.grid}>
        <GameGrid games={games} />
      </div>
    </div>
  );
};

export default Sales; 