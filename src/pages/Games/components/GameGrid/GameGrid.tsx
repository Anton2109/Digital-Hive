import GameCard from '../GameCard/GameCard';
import styles from './GameGrid.module.css';

interface Game {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  discount?: number;
}

interface GameGridProps {
  games: Game[];
}

const GameGrid = ({ games }: GameGridProps) => {
  return (
    <div className={styles.grid}>
      {games.map(game => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          price={game.price}
          imageUrl={game.imageUrl}
          discount={game.discount}
        />
      ))}
    </div>
  );
};

export default GameGrid; 