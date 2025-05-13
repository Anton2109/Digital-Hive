import { useState, useEffect, useCallback } from "react";

interface UseFavoritesReturn {
  isFavorite: boolean;
  toggleFavorite: () => void;
  error: Error | null;
}

export const useFavorites = (gameId: number): UseFavoritesReturn => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const favorites = JSON.parse(
        localStorage.getItem("favoriteGames") || "[]"
      );
      setIsFavorite(favorites.includes(gameId));
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error("Ошибка при чтении избранного")
      );
      console.error("Error reading favorites:", error);
    }
  }, [gameId]);

  const toggleFavorite = useCallback(() => {
    try {
      const favorites = JSON.parse(
        localStorage.getItem("favoriteGames") || "[]"
      );
      const updatedFavorites = isFavorite
        ? favorites.filter((id: number) => id !== gameId)
        : [...favorites, gameId];

      localStorage.setItem(
        "favoriteGames",
        JSON.stringify(updatedFavorites)
      );
      setIsFavorite(!isFavorite);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error("Ошибка при обновлении избранного")
      );
      console.error("Error updating favorites:", error);
    }
  }, [gameId, isFavorite]);

  return { isFavorite, toggleFavorite, error };
};
