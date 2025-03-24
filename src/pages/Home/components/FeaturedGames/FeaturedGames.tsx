import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedGame } from '@/types/game';
import styles from './FeaturedGames.module.css';

const FeaturedGames = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const featuredGames: FeaturedGame[] = [
    {
      id: '1',
      title: 'Deus Ex: Mankind Divided',
      description: 'Игра года по версии многих критиков. Погрузитесь в киберпанк-мир будущего.',
      price: 1999,
      discountPrice: 999,
      discount: 50,
      image: '/src/assets/images/demn.jpeg',
      releaseDate: '2023-01-15',
      featured: true
    },
    {
      id: '2',
      title: 'Cyberpunk 2077',
      description: 'Откройте для себя мир будущего в этой захватывающей RPG.',
      price: 2499,
      discountPrice: 1749,
      discount: 30,
      image: '/src/assets/images/cyberpunk.jpg',
      releaseDate: '2023-02-20',
      featured: true
    },
    {
      id: '3',
      title: 'Elden Ring',
      description: 'Новая игра от создателей Dark Souls. Исследуйте огромный открытый мир.',
      price: 2999,
      discountPrice: 2399,
      discount: 20,
      image: '/src/assets/images/elden.avif',
      releaseDate: '2023-03-10',
      featured: true
    }
  ];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  useEffect(() => {
    if (!isHovered && !isTransitioning) {
      const interval = setInterval(nextSlide, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, isTransitioning, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && !isTransitioning) {
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  return (
    <div
      ref={sliderRef}
      className={styles.slider}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.slides}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {featuredGames.map((game, index) => (
          <div 
            key={game.id} 
            className={`${styles.slide} ${currentSlide === index ? styles.active : ''}`}
          >
            <div className={styles.slideContent}>
              <div className={styles.slideInfo}>
                <h2 className={styles.gameTitle}>{game.title}</h2>
                <p className={styles.gameDescription}>{game.description}</p>
                <div className={styles.priceBlock}>
                  {game.discount && (
                    <span className={styles.discount}>-{game.discount}%</span>
                  )}
                  <div className={styles.prices}>
                    {game.discountPrice ? (
                      <>
                        <span className={styles.oldPrice}>{game.price} ₽</span>
                        <span className={styles.newPrice}>{game.discountPrice} ₽</span>
                      </>
                    ) : (
                      <span className={styles.newPrice}>{game.price} ₽</span>
                    )}
                  </div>
                </div>
                <Link to={`/games/${game.id}`} className={styles.buyButton}>
                  Купить сейчас
                  <div className={styles.buttonGlitch} />
                </Link>
              </div>
              <div
                className={styles.slideImage}
                style={{ backgroundImage: `url(${game.image})` }}
              >
                <div className={styles.imageOverlay} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.sliderControls}>
        {featuredGames.map((_, index) => (
          <button
            key={index}
            className={`${styles.sliderDot} ${currentSlide === index ? styles.active : ''}`}
            onClick={() => {
              if (!isTransitioning && currentSlide !== index) {
                setIsTransitioning(true);
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 800);
              }
            }}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
      <div className={styles.sliderProgress}>
        <div
          className={styles.progressBar}
          style={{
            width: `${((currentSlide + 1) / featuredGames.length) * 100}%`,
            transition: isTransitioning ? 'none' : 'width 5s linear'
          }}
        />
      </div>
    </div>
  );
};

export default FeaturedGames; 