import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart, FaSearch } from "react-icons/fa";
import { NavItem } from "@/types/navigation";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const navItems: NavItem[] = [
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchValue);
  };

  return (
    <header className={styles.container}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logoLink}>
          <h1 className={`${styles.logo} ${isGlitching ? styles.glitch : ""}`}>
            Digital<span>Hive</span>
          </h1>
        </Link>

        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <FaSearch size={16} />
          </div>
        </form>
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
