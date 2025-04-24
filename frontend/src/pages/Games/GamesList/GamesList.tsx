import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
          const categoryGames = await GameService.getGamesByCategoryId(
            Number(categoryId)
          );
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
      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <Link key={game.id} to={`/games/${game.name}`}>
            <div key={game.id} className={styles.gameCard}>
              <img
                src={game.img}
                alt={game.name}
                className={styles.gameImage}
              />
              <h3 className={styles.gameTitle}>{game.name}</h3>
              <p className={styles.gamePrice}>{game.price} ₽</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
