import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '@/types/category';
import styles from './Categories.module.css';
import GameService from '@/API/GameService';

const Categories = () => {
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect (() => {
    const fecthCategories = async () => {
      try {
        const data = await GameService.getCategories()
        setCategories(data)
      } catch (error) {
        console.log("Ошибка при получении категорий:", error)
      }
    }

    fecthCategories()
  },[])

  return (
    <section className={styles.categories}>
      <h2 className={styles.title}>Популярные категории</h2>
      <div className={styles.grid}>
        {categories.slice(0, 6).map((category) => (
          <Link key={category.id} to={`/games?categoryId=${category.id}`} className={styles.categoryCard}>
            <div
              className={styles.categoryImage}
              style={{ backgroundImage: `url(${category.categoriesImg})` }}
            />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;