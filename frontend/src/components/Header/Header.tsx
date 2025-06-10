import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { INavigation } from "@/interfaces/navigation";
import styles from "./Header.module.css";
import Search from "../Search/Search";
import { IGame } from "@/interfaces/game";
import { useGameSearch } from "@/hooks/useGameSearch";

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    // { name: "Скидки", path: "/games/sales" },
    // { name: "Популярные", path: "/games/popular" },
    { name: "Все игры", path: "/games" },
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

        <div className={styles.mobileControls}>
          <button 
            className={styles.searchButton}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FaSearch size={20} />
          </button>
          {!isMobileMenuOpen && (
            <button 
              className={styles.burgerButton}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FaBars size={24} />
            </button>
          )}
        </div>

        <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchOpen : ''}`}>
          <Search
            searchValue={searchValue}
            setSearchValue={handleSearchChange}
            searchResults={results}
            isLoading={isLoading}
            onResultClick={handleResultClick}
            clearSearch={clearSearch}
          />
        </div>
      </div>

      <div className={`${styles.navWrapper} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FaTimes size={24} />
        </button>
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
                <Link 
                  to={item.path} 
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
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
