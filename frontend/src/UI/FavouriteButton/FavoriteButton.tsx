import { useCallback, memo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./FavoriteButton.module.css";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  gameId: number;
  className?: string;
  onError?: (error: Error) => void;
}

export const FavoriteButton = memo(({ 
  gameId, 
  className = "", 
  onError 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite, error } = useFavorites(gameId);

  if (error && onError) {
    onError(error);
  }

  const handleToggleFavorite = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  }, [toggleFavorite]);

  return (
    <button
      onClick={handleToggleFavorite}
      className={`${styles.favoriteButton} ${className}`}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <span className={styles.favoriteIcon}>
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </span>
    </button>
  );
});