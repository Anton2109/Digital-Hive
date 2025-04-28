import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { INavigation } from "@/types/navigation";
import styles from "./Header.module.css";
import Search from "../Search/Search";
import { IGame } from "@/types/game";
import { useGameSearch } from "@/hooks/useGameSearch";

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { searchValue, results, isLoading, handleSearchChange, clearSearch } =
    useGameSearch();

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const navItems: INavigation[] = [
    { name: "Главная", path: "/" },
    { name: "Скидки", path: "/games/sales" },
    { name: "Популярные", path: "/games/popular" },
    {
      name: "Избранное",
      path: "/user/favourites",
      icon: <FaHeart size={16} />,
    },
    {
      name: "Корзина",
      path: "/user/basket",
      icon: <FaShoppingCart size={16} />,
    },
    {
      name: "Профиль",
      path: "/user/profile",
      icon: <FaUser size={16} />,
    },
  ];

  const handleItemHover = (item: string | null) => {
    setActiveItem(item);
  };

  const handleResultClick = (game: IGame) => {
    navigate(`/games/${game.id}`);
  };

  return (
    <header className={styles.container}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logoLink}>
          <h1 className={`${styles.logo} ${isGlitching ? styles.glitch : ""}`}>
            Digital<span>Hive</span>
          </h1>
        </Link>

        <Search
          searchValue={searchValue}
          setSearchValue={handleSearchChange}
          searchResults={results}
          isLoading={isLoading}
          onResultClick={handleResultClick}
          clearSearch={clearSearch}
        />
      </div>

      <div className={styles.navWrapper}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`${styles.navItem} ${
                  location.pathname === item.path ? styles.active : ""
                } ${activeItem === item.name ? styles.hovered : ""}`}
                onMouseEnter={() => handleItemHover(item.name)}
                onMouseLeave={() => handleItemHover(null)}
              >
                <Link to={item.path} className={styles.navLink}>
                  {item.name}
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
