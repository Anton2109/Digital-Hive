import { useState } from 'react';
import { ICategory } from '@/interfaces/category';
import { SortType } from '@/types/SortType';
import styles from './AdvancedGameFilters.module.css';
import { SORT_OPTIONS } from "@/constants";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface AdvancedGameFiltersProps {
  categories: ICategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const AdvancedGameFilters = ({
  categories,
  selectedCategory,
  onSelectCategory,
  currentSort,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: AdvancedGameFiltersProps) => {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const INITIAL_CATEGORIES_COUNT = 4;

  const visibleCategories = isCategoriesExpanded 
    ? categories 
    : categories.slice(0, INITIAL_CATEGORIES_COUNT);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onPriceChange(value, maxPrice);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onPriceChange(minPrice, value);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterSection}>
        <h3>Категории</h3>
        <div className={styles.categories}>
          <button
            className={`${styles.categoryButton} ${
              selectedCategory === null ? styles.active : ""
            }`}
            onClick={() => onSelectCategory(null)}
          >
            Все игры
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                selectedCategory === category.id ? styles.active : ""
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
          {categories.length > INITIAL_CATEGORIES_COUNT && (
            <button
              className={styles.expandButton}
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            >
              {isCategoriesExpanded ? (
                <>
                  Скрыть
                  <IoIosArrowUp className={styles.expandIcon} />
                </>
              ) : (
                <>
                  Показать еще
                  <IoIosArrowDown className={styles.expandIcon} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Цена</h3>
        <div className={styles.priceInputs}>
          <div className={styles.priceInput}>
            <label htmlFor="minPrice">От</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice || ''}
              onChange={handleMinPriceChange}
              placeholder="0"
              min="0"
            />
            <span className={styles.currency}>₽</span>
          </div>
          <div className={styles.priceInput}>
            <label htmlFor="maxPrice">До</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice || ''}
              onChange={handleMaxPriceChange}
              placeholder="∞"
              min="0"
            />
            <span className={styles.currency}>₽</span>
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Сортировка</h3>
        <select
          className={styles.sortSelect}
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortType)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
