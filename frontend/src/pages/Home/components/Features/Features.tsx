import { FaGamepad, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { Feature } from '@/types/feature';
import styles from './Features.module.css';

const features: Feature[] = [
  {
    id: '1',
    icon: <FaGamepad size={24} />,
    title: 'Большой выбор игр',
    description: 'Тысячи игр различных жанров от лучших разработчиков'
  },
  {
    id: '2',
    icon: <FaShieldAlt size={24} />,
    title: 'Безопасные покупки',
    description: 'Гарантированная защита ваших платежей и данных'
  },
  {
    id: '3',
    icon: <FaHeadset size={24} />,
    title: 'Поддержка 24/7',
    description: 'Наша служба поддержки всегда готова помочь вам'
  }
];

const Features = () => {
  return (
    <section className={styles.features}>
      <h2 className={styles.title}>Почему выбирают нас</h2>
      <div className={styles.grid}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.featureCard}>
            <div className={styles.iconWrapper}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features; 