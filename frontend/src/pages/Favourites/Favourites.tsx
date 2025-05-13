import { useEffect, useState } from "react";
import { IGameCard } from "@/interfaces/game";
import GameService from "@/API/GameService";
import styles from "./Favourites.module.css";
import { Link } from "react-router-dom";

const Favourites = () => {
  const [favoriteGames, setFavoriteGames] = useState<IGameCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteGames = async () => {
      try {
        const favoriteIds = JSON.parse(
          localStorage.getItem("favoriteGames") || "[]"
        ) as number[];
        const games = await Promise.all(
          favoriteIds.map((id: number) => GameService.getGameById(id))
        );
        setFavoriteGames(
          games.filter((game): game is IGameCard => game !== null)
        );
      } catch (error) {
        console.error("Ошибка при загрузке избранных игр:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteGames();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (favoriteGames.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>У вас пока нет избранных игр</h2>
        <p>Добавляйте игры в избранное, чтобы они появились здесь</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранные игры</h1>
      <div className={styles.gamesGrid}>
        {favoriteGames.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className={styles.gameLink}
          >
            <div className={styles.gameCard}>
              <img src={game.img_path} alt={game.name} />
              <h3>{game.name}</h3>
              <p className={styles.price}>{game.price} ₽</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
