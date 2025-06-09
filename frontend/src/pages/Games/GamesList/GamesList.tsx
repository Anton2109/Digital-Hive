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
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gamesPerPage] = useState(12);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const price = game.price;
      const meetsMinPrice = minPrice === 0 || price >= minPrice;
      const meetsMaxPrice = maxPrice === 0 || price <= maxPrice;
      return meetsMinPrice && meetsMaxPrice;
    });
  }, [games, minPrice, maxPrice]);

  const sortedGames = useMemo(
    () => sortGames(filteredGames, sortType),
    [filteredGames, sortType]
  );

  const currentGames = useMemo(() => {
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    return sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  }, [sortedGames, currentPage, gamesPerPage]);

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

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
      <aside className={styles.filtersPanel}>
        <AdvancedGameFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentSort={sortType}
          onSortChange={setSortType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
        />
      </aside>

      <main className={styles.mainContent}>
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
      </main>
    </div>
  );
};

export default GamesList;
