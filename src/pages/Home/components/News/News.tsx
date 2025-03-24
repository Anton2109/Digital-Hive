import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '@/types/news';
import styles from './News.module.css';

const news: NewsItem[] = [
  {
    id: '1',
    title: 'Новые обновления для популярных игр',
    excerpt: 'Узнайте о последних обновлениях и улучшениях в ваших любимых играх.',
    date: '15 марта 2025',
    image: '/images/news/updates.jpg',
    link: '/news/updates'
  },
  {
    id: '2',
    title: 'Турнир по Counter Strike 2',
    excerpt: 'Присоединяйтесь к просмотру и делайте ставки на один икс бет.',
    date: '10 марта 2025',
    image: '/images/news/tournament.jpg',
    link: '/news/tournament'
  },
  {
    id: '3',
    title: 'Новые игры в каталоге',
    excerpt: 'Познакомьтесь с новыми играми, в нашем каталоге.',
    date: '5 марта 2025',
    image: '@/assets/images/deus-ex.jpg',
    link: '/news/new-games'
  }
];

const News: React.FC = () => {
  return (
    <section className={styles.news}>
      <h2 className={styles.title}>Новости</h2>
      <div className={styles.grid}>
        {news.map((item) => (
          <Link key={item.id} to={item.link} className={styles.newsCard}>
            <div 
              className={styles.newsImage}
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className={styles.newsContent}>
              <span className={styles.newsDate}>{item.date}</span>
              <h3 className={styles.newsTitle}>{item.title}</h3>
              <p className={styles.newsExcerpt}>{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default News; 