import { useParams } from 'react-router-dom';
import styles from './GameDetails.module.css';

const GameDetails = () => {
  const { gameId } = useParams();

  return (
    <div className={styles.container}>
      <h1>Об игре {gameId}</h1>
    </div>
  );
};

export default GameDetails; 