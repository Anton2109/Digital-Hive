import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.glitchWrapper}>
        <h1 className={styles.glitchText} data-text="404">404</h1>
      </div>
      <p className={styles.message}>Такой страницы не существует</p>
      <Link to="/" className={styles.link}>
        Вернуться на главную
        <span className={styles.arrow}>→</span>
      </Link>
    </div>
  );
};

export default NotFound; 