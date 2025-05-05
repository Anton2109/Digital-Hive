import { useState } from "react";
import { ICategory } from '@/interfaces/category';
import { SortType } from '@/types/SortType';
import styles from './AdvancedGameFilters.module.css';
import { VscFilter } from 'react-icons/vsc';
import { SORT_OPTIONS } from "@/constants";

interface AdvancedGameFiltersProps {
  categories: ICategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  currentSort: SortType;
  onSortChange: (sortType: SortType) => void;
}

export const AdvancedGameFilters = ({
  categories,
  selectedCategory,
  onSelectCategory,
  currentSort,
  onSortChange,
}: AdvancedGameFiltersProps) => {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('filtersOpen');
    return savedState ? savedState === 'true' : false;
  });

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('filtersOpen', String(newState));
  };

  return (
    <div className={styles.filters}>
      <button className={styles.btnWrapper} onClick={handleToggle}>
        <span className={styles.btnFilter}>Фильтры</span>
        <VscFilter size={20} />
      </button>

      <div className={`${styles.filtersContent} ${isOpen ? styles.open : ""}`}>
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
            {categories.map((category) => (
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
    </div>
  );
};
