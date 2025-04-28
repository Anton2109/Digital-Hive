import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { IGame } from "@/types/game";
import GameService from "@/API/GameService";

export const useGameSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<IGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchGames = useCallback(
    debounce(async (query: string) => {
      const trimmedQuery = query.trim();

      console.log("Отправка запроса:", query);

      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
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
    }, 600),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const trimmedValue = value.trim();

    if (trimmedValue) {
      setIsLoading(true);
      searchGames(value);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setResults([]);
  };

  return {
    searchValue,
    results,
    isLoading,
    handleSearchChange,
    setResults,
    clearSearch,
  };
};
