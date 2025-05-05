import { SortType } from "@/types/SortType";
import styles from "./Sorting.module.css";
import { SORT_OPTIONS } from "@/constants";

interface SortingProps {
  currentSort: SortType;
  onSortChange: (type: SortType) => void;
}

const Sorting = ({ currentSort, onSortChange }: SortingProps) => {
  return (
    <div className={styles.sorting}>
      <h1 className={styles.title}>Сортировка</h1>
      <select
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
  );
};

export default Sorting;
