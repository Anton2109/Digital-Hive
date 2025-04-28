import { FaSearch } from "react-icons/fa";
import { useEffect, useRef } from "react";
import styles from "./Search.module.css";
import { IGame } from "@/types/game";

interface ISearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchResults: IGame[];
  isLoading: boolean;
  onResultClick: (game: IGame) => void;
  clearSearch: () => void;
}

const Search = ({
  searchValue,
  setSearchValue,
  searchResults,
  isLoading,
  onResultClick,
  clearSearch,
}: ISearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (game: IGame) => {
    onResultClick(game);
    clearSearch();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSearch]);

  return (
    <div className={styles.searchWrapper} ref={searchRef}>
      <form className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск игр..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoComplete="off"
          maxLength={20}
        />
        <button type="button" className={styles.searchIcon}>
          <FaSearch size={16} />
        </button>
      </form>

      {searchValue.trim() && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.searchLoading}>Загрузка...</div>
          ) : (
            <>
              {searchResults.length > 0 ? (
                searchResults.map((game) => (
                  <div
                    key={game.id}
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(game)}
                  >
                    <img
                      src={game.img}
                      alt={game.name}
                      className={styles.searchResultImage}
                    />
                    <span className={styles.searchResultName}>{game.name}</span>
                    {game.price && (
                      <span className={styles.searchResultPrice}>
                        {game.price} ₽
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>Ничего не найдено</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
