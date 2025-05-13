import { useEffect, useState, useMemo } from "react";
import styles from "./GamesList.module.css";
import { IGame } from "@/interfaces/game";
import { ICategory } from "@/interfaces/category";
import GameService from "@/API/GameService";
import Loader from "@/UI/Loader/Loader";
import { AdvancedGameFilters } from "../components/AdvancedGameFilters/AdvancedGameFilters";
import { SortType } from "@/types/SortType";
import { sortGames } from "@/utils/gameSorting";
import Pagination from "@/components/Pagination/Pagination";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard/GameCard";

const GamesList = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>("price_asc");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gamesPerPage] = useState(12);

  const sortedGames = useMemo(
    () => sortGames(games, sortType),
    [games, sortType]
  );

  const currentGames = useMemo(() => {
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    return sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  }, [sortedGames, currentPage, gamesPerPage]);

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

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.filtersPanel}>
        <AdvancedGameFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentSort={sortType}
          onSortChange={setSortType}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.gamesGrid}>
          {currentGames.length > 0 ? (
            currentGames.map((game) => (
              <Link key={game.id} to={`/games/${game.id}`}>
                <GameCard game={game} />
              </Link>
            ))
          ) : (
            <p className={styles.noGames}>Игры не найдены</p>
          )}
        </div>

        {sortedGames.length > gamesPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedGames.length / gamesPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default GamesList;
