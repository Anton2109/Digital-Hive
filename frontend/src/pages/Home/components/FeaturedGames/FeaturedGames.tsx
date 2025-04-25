import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FeaturedGame } from "@/types/game";
import styles from "./FeaturedGames.module.css";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const FeaturedGames = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const featuredGames: FeaturedGame[] = [
    {
      id: "1",
      name: "Deus Ex: Mankind Divided",
      description:
        "Игра года по версии многих критиков. Погрузитесь в киберпанк-мир будущего.",
      price: 1999,
      discountPrice: 999,
      discount: 50,
      img: "/src/assets/images/demn.jpeg",
      featured: true,
    },
    {
      id: "2",
      name: "Cyberpunk 2077",
      description: "Откройте для себя мир будущего в этой захватывающей RPG.",
      price: 2499,
      discountPrice: 1749,
      discount: 30,
      img: "/src/assets/images/cyberpunk.jpg",
      featured: true,
    },
    {
      id: "3",
      name: "Elden Ring",
      description:
        "Новая игра от создателей Dark Souls. Исследуйте огромный открытый мир.",
      price: 2999,
      discountPrice: 2399,
      discount: 20,
      img: "/src/assets/images/elden.avif",
      featured: true,
    },
  ];

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.autoplay[isHovered ? 'stop' : 'start']();
    }
  }, [isHovered]);

  return (
    <div
      className={styles.slider}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Autoplay, Pagination]}

        onSwiper={(swiper) => (swiperRef.current = swiper)}

        autoplay={{ delay: 1500, disableOnInteraction: false }}

        pagination={{
          clickable: true,
          bulletClass: styles.sliderDot,
          bulletActiveClass: styles.active,
        }}

        speed={800}

        loop={true}

        slidesPerView={1}

        spaceBetween={0}

        centeredSlides={true}
        
        style={{ height: '100%' }}
      >
        {featuredGames.map((game) => (
          <SwiperSlide key={game.id} className={styles.swiperSlide}>
            <div className={styles.slideContent}>
              <div className={styles.slideInfo}>
                <h2 className={styles.gameTitle}>{game.name}</h2>
                <p className={styles.gameDescription}>{game.description}</p>
                <div className={styles.priceBlock}>
                  {game.discount && (
                    <span className={styles.discount}>-{game.discount}%</span>
                  )}
                  <div className={styles.prices}>
                    {game.discountPrice ? (
                      <>
                        <span className={styles.oldPrice}>{game.price} ₽</span>
                        <span className={styles.newPrice}>
                          {game.discountPrice} ₽
                        </span>
                      </>
                    ) : (
                      <span className={styles.newPrice}>{game.price} ₽</span>
                    )}
                  </div>
                </div>
                <Link to={`/games/${game.name}`} className={styles.buyButton}>
                  Купить сейчас
                  <div className={styles.buttonGlitch} />
                </Link>
              </div>
              <div
                className={styles.slideImage}
                style={{ backgroundImage: `url(${game.img})` }}
              >
                <div className={styles.imageOverlay} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedGames;