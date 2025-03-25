import { useEffect, useState } from "react";
import styles from "./GamesList.module.css";
import { IGame } from "@/types/game";
import GameService from "@/API/GameService";
import { useSearchParams } from "react-router-dom";

const GamesList = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (categoryId) {
          const categoryGames = await GameService.getGamesByCategoryId(Number(categoryId));
          setGames(categoryGames);
        } else {
          const allGames = await GameService.getGames();
          setGames(allGames);
        }
      } catch (error) {
        console.error("Ошибка при загрузке игр по категории:", error);
      }
    };

    fetchGames();
  }, [categoryId]);

  return (
    <div className={styles.container}>
      <h1>`Игры по категории ${categoryId}`</h1>

      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <div key={game.id} className={styles.gameCard}>
            <img 
              src={game.img} 
              alt={game.title} 
              className={styles.gameImage}
            />
            <h3 className={styles.gameTitle}>{game.title}</h3>
            <p className={styles.gamePrice}>{game.price} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
