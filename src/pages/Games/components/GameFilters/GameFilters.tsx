import { useState } from 'react';
import styles from './GameFilters.module.css';

interface GameFiltersProps {
  onFilterChange: (filters: GameFilters) => void;
}

interface GameFilters {
  genre?: string;
  priceRange?: [number, number];
  sortBy?: 'price' | 'rating' | 'releaseDate';
}

const genres = [
  'Все',
  'Action',
  'RPG',
  'Strategy',
  'Adventure',
  'Simulation',
  'Sports',
  'Racing'
];

const GameFilters = ({ onFilterChange }: GameFiltersProps) => {
  const [filters, setFilters] = useState<GameFilters>({});
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleFilterChange = (newFilters: Partial<GameFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      handleFilterChange({ priceRange: [min, max] });
    }
  };

  return (
    <div className={styles.filters}>
      <h3>Фильтры</h3>
      
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Жанр</label>
        <select
          className={styles.filterSelect}
          value={filters.genre || 'Все'}
          onChange={(e) => handleFilterChange({ genre: e.target.value })}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Цена</label>
        <div className={styles.priceRange}>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="От"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className={styles.priceInput}
            placeholder="До"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button className={styles.filterButton} onClick={handlePriceChange}>
          Применить
        </button>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Сортировать по</label>
        <select
          className={styles.filterSelect}
          value={filters.sortBy || 'rating'}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value as GameFilters['sortBy'] })}
        >
          <option value="rating">Рейтингу</option>
          <option value="price">Цене</option>
          <option value="releaseDate">Дате выхода</option>
        </select>
      </div>
    </div>
  );
};

export default GameFilters; 