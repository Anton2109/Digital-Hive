import { Link } from 'react-router-dom';
import { FaTelegram, FaDiscord, FaVk } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaVk size={20} />, url: 'https://vk.com', label: 'Vk' },
    { icon: <FaTelegram size={20} />, url: 'https://telegram.org', label: 'Telegram' },
    { icon: <FaDiscord size={20} />, url: 'https://discord.com', label: 'Discord' },
  ];

  // const footerLinks = [
  //   { name: 'О нас', path: '/info/about' },
  //   { name: 'Условия использования', path: '/info/terms' },
  //   { name: 'Политика конфиденциальности', path: '/info/privacy' },
  //   { name: 'Поддержка', path: '/info/support' },
  // ];

  const footerLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Все игры', path: '/games' },
    { name: 'Избранное', path: '/user/favourites' },
    { name: 'Профиль', path: '/user/profile' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <Link to="/" className={styles.logoLink}>
              <h2 className={styles.logo}>
                Digital<span>Hive</span>
              </h2>
            </Link>
            <p className={styles.description}>
              Ваш цифровой магазин игр и развлечений. Погрузитесь в мир новейших технологий и захватывающих приключений.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Навигация</h3>
            <ul className={styles.linkList}>
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={styles.link}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Мы в соцсетях</h3>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {currentYear} DigitalHive. Все права защищены.
          </div>
          <div className={styles.poweredBy}>
            Powered by <span className={styles.accent}>Digital</span>Hive
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
