import styles from "./GameFilters.module.css";
import { VscFilter } from "react-icons/vsc";

const GameFilters = () => {
  return (
    <div className={styles.filters}>
      <div className={styles.btnWrapper}>
        <button className={styles.btnFilter}>Фильтры</button>
        <VscFilter />
      </div>
    </div>
  );
};

export default GameFilters;
