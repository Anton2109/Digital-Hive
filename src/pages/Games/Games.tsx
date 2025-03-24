import { Outlet } from 'react-router-dom';
import styles from './Games.module.css';

const Games = () => {
  return (
    <div className={styles.gamesLayout}>
      <Outlet />
    </div>
  );
};

export default Games; 