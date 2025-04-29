import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./GamesList.module.css";
import { IGame } from "@/types/game";
import { ICategory } from "@/types/category";
import GameService from "@/API/GameService";
import Loader from "@/UI/Loader/Loader";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";

const GamesList = () => {
  const [games, setGames] = useState<IGame[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await GameService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const gamesData = selectedCategory
          ? await GameService.getGamesByCategoryId(selectedCategory)
          : await GameService.getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Ошибка при загрузке игр:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <div className={styles.gamesGrid}>
          {games.length > 0 ? (
            games.map((game) => (
              <Link key={game.id} to={`/games/${game.id}`}>
                <div className={styles.gameCard}>
                  <img
                    src={game.img}
                    alt={game.name}
                    className={styles.gameImage}
                  />
                  <h3 className={styles.gameTitle}>{game.name}</h3>
                  <p className={styles.gamePrice}>{game.price} ₽</p>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noGames}>
              Игр в этой категории не найдено
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesList;
