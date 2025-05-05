import { IGame } from "@/interfaces/game";
import { SortType } from "@/types/SortType";
import { memoize } from "lodash";

export const sortGames = memoize(
  (games: IGame[], sortType: SortType): IGame[] => {
    const gamesCopy = [...games];

    switch (sortType) {
      case "price_asc":
        return gamesCopy.sort((a, b) => a.price - b.price);
      case "price_desc":
        return gamesCopy.sort((a, b) => b.price - a.price);
      case "name_asc":
        return gamesCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return gamesCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return gamesCopy;
    }
  },
  (games: IGame[], sortType: SortType) => {
    return `${sortType}-${games.map((game) => game.id).join(",")}`;
  }
);

export default sortGames;
