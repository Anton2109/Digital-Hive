import { useState } from 'react';
import styles from './Popular.module.css';
import GameGrid from '../components/GameGrid';
import GameFilters from '../components/GameFilters';

interface Game {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  genre: string[];
  discount?: number;
  rating: number;
  reviews: number;
}

const Popular = () => {
  const [games] = useState<Game[]>([
    {
      id: '1',
      title: 'Elden Ring',
      price: 59.99,
      imageUrl: 'https://placehold.co/600x400',
      genre: ['RPG', 'Action'],
      rating: 4.9,
      reviews: 125000
    },
    {
      id: '2',
      title: 'God of War',
      price: 49.99,
      imageUrl: 'https://placehold.co/600x400',
      genre: ['Action', 'Adventure'],
      rating: 4.8,
      reviews: 98000
    },
  ]);

  const handleFilterChange = (filters: any) => {
    console.log('Фильтры:', filters);
  };

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

      <div className={styles.filters}>
        <GameFilters onFilterChange={handleFilterChange} />
      </div>

      <div className={styles.grid}>
        <GameGrid games={games} />
      </div>
    </div>
  );
};

export default Popular; 