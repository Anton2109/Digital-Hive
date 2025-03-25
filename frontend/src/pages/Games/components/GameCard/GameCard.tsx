import { Link } from 'react-router-dom';
import styles from './GameCard.module.css';

interface GameCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  discount?: number;
}

const GameCard = ({ id, title, price, imageUrl, discount }: GameCardProps) => {
  return (
    <Link to={`/games/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />
        {discount && <div className={styles.discount}>-{discount}%</div>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.price}>
          {discount ? (
            <>
              <span className={styles.oldPrice}>${price}</span>
              <span className={styles.newPrice}>
                ${price * (1 - discount / 100)}
              </span>
            </>
          ) : (
            <span>${price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard; 