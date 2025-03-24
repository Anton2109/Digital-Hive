import { Link } from 'react-router-dom';
import { Category } from '@/types/category';
import styles from './Categories.module.css';

import actionImage from '@/assets/images/forza4.jpg';
import rpgImage from '@/assets/images/demn.jpeg';
import strategyImage from '@/assets/images/cyberpunk.jpg';
import simulatorImage from '@/assets/images/elden.avif';

const categories: Category[] = [
  {
    id: '1',
    title: 'Экшен',
    image: actionImage,
    link: '/games?category=action'
  },
  {
    id: '2',
    title: 'RPG',
    image: rpgImage,
    link: '/games?category=rpg'
  },
  {
    id: '3',
    title: 'Стратегии',
    image: strategyImage,
    link: '/games?category=strategy'
  },
  {
    id: '4',
    title: 'Симуляторы',
    image: simulatorImage,
    link: '/games?category=simulator'
  }
];

const Categories = () => {
  return (
    <section className={styles.categories}>
      <h2 className={styles.title}>Популярные категории</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link key={category.id} to={category.link} className={styles.categoryCard}>
            <div
              className={styles.categoryImage}
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories; 