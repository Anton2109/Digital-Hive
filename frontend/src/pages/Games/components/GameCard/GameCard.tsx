import styles from "./GameCard.module.css";
import { IGameBase } from "@/interfaces/game";
import { FavoriteButton } from "@/UI/FavouriteButton/FavoriteButton";

interface GameCardProps {
  game: IGameBase;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className={styles.gameCard}>
      <div className={styles.imageContainer}>
        <img src={game.img_path} alt={game.name} className={styles.gameImage} />
        <FavoriteButton gameId={game.id} className={styles.favoriteButton} />
      </div>
      <h3 className={styles.gameTitle}>{game.name}</h3>
      <p className={styles.gamePrice}>{game.price} ₽</p>
    </div>
  );
};

export default GameCard;
