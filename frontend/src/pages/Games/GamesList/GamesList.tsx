import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./GamesList.module.css";
import { IGame } from "@/interfaces/game";
import { ICategory } from "@/interfaces/category";
import GameService from "@/API/GameService";
import Loader from "@/UI/Loader/Loader";
import { AdvancedGameFilters } from "../components/AdvancedGameFilters/AdvancedGameFilters";
import { SortType } from "@/types/SortType";
import { sortGames } from "@/utils/gameSorting";

const GamesList = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>("price_asc");

  const sortedGames = useMemo(
    () => sortGames(games, sortType),
    [games, sortType]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, gamesData] = await Promise.all([
          GameService.getCategories(),
          selectedCategory
            ? GameService.getGamesByCategoryId(selectedCategory)
            : GameService.getGames(),
        ]);
        setCategories(categoriesData);
        setGames(gamesData);
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const onCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      <div className={styles.filtersPanel}>
        <AdvancedGameFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onCategorySelect}
          currentSort={sortType}
          onSortChange={setSortType}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.gamesGrid}>
          {sortedGames.length > 0 ? (
            sortedGames.map((game) => (
              <Link key={game.id} to={`/games/${game.id}`}>
                <div className={styles.gameCard}>
                  <img
                    src={game.img_path}
                    alt={game.name}
                    className={styles.gameImage}
                  />
                  <h3 className={styles.gameTitle}>{game.name}</h3>
                  <p className={styles.gamePrice}>{game.price} ₽</p>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.noGames}>Игры не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesList;
