import { useEffect, useState } from "react";
import { IGameCard } from "@/interfaces/game";
import GameService from "@/API/GameService";
import styles from "./Favourites.module.css";
import { Link } from "react-router-dom";
import Loader from "@/UI/Loader/Loader";
import { FavoriteButton } from "@/UI/FavouriteButton/FavoriteButton";

const Favourites = () => {
  const [favoriteGames, setFavoriteGames] = useState<IGameCard[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadFavoriteGames();
  }, []);

  const handleFavoriteError = (error: Error) => {
    console.error("Ошибка при работе с избранным:", error);
    loadFavoriteGames();
  };

  if (loading) {
    return <div><Loader/></div>;
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
          <div key={game.id} className={styles.gameCard}>
            <Link to={`/games/${game.id}`} className={styles.gameLink}>
              <img src={game.img_path} alt={game.name} />
              <h3>{game.name}</h3>
              <p className={styles.price}>{game.price} ₽</p>
            </Link>
            <FavoriteButton 
              gameId={game.id} 
              className={styles.favoriteButton}
              onError={handleFavoriteError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
