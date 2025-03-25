import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

import img from '@/assets/images/forza4.jpg'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <img
        src={img}
        alt="Hero background"
        className={styles.heroBackground}
      />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Добро пожаловать в мир цифровых развлечений
        </h1>
        <p className={styles.heroSubtitle}>
          Откройте для себя тысячи игр и погрузитесь в незабываемые приключения
        </p>
        <Link to="/games" className={styles.heroButton}>
          Начать поиск
        </Link>
      </div>
    </section>
  );
};

export default Hero; 