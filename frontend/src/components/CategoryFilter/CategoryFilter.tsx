import { ICategoryFilterProps } from "@/interfaces/category";
import styles from "./CategoryFilter.module.css";

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: ICategoryFilterProps) => {
  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.filterTitle}>Категории</h3>
      <ul className={styles.filterList}>
        <li
          className={`${styles.filterItem} ${
            selectedCategory === null ? styles.active : ""
          }`}
          onClick={() => onSelectCategory(null)}
        >
          Все игры
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`${styles.filterItem} ${
              selectedCategory === category.id ? styles.active : ""
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
