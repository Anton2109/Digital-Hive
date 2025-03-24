import { useState } from 'react';
import styles from './GamesList.module.css';

interface Game {
  id: string;
  title: string;
  genre: string[];
}

const GamesList = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  return (
    <div className={styles.container}>
      <h1>Все игры</h1>
    </div>
  );
};

export default GamesList; 