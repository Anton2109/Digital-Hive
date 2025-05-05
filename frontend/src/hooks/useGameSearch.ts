import { useState, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { IGame } from "@/interfaces/game";
import GameService from "@/API/GameService";

export const useGameSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      try {
        const data = await GameService.searchGames(query);
        const filtered = data.filter((game) =>
          game.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error("Ошибка поиска:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 600)
  ).current;

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      const trimmedValue = value.trim();

      if (trimmedValue) {
        setIsLoading(true);
        debouncedSearch(value);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    },
    [debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchValue("");
    setResults([]);
  }, []);

  return {
    searchValue,
    results,
    isLoading,
    handleSearchChange,
    clearSearch,
  };
};
