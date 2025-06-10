import { FaSearch } from "react-icons/fa";
import { useEffect, useRef } from "react";
import styles from "./Search.module.css";
import { IGame } from "@/interfaces/game";
import Loader from "@/UI/Loader/Loader";

interface ISearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchResults: IGame[];
  isLoading: boolean;
  onResultClick: (game: IGame) => void;
  clearSearch: () => void;
  isAdminPanel?: boolean;
}

const Search = ({
  searchValue,
  setSearchValue,
  searchResults,
  isLoading,
  onResultClick,
  clearSearch,
  isAdminPanel = false,
}: ISearchProps) => {
  const searchRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (game: IGame) => {
    onResultClick(game);
    clearSearch();
  };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchRef.current &&
  //       !searchRef.current.contains(event.target as Node)
  //     ) {
  //       clearSearch();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [clearSearch]);

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

      {searchValue.trim() && !isAdminPanel && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div><Loader/></div>
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
                      src={game.img_path}
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
