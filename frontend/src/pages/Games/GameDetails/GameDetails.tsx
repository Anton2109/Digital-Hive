import { useState, useEffect } from "react";
import { IGameCard } from "@/interfaces/game";
import GameService from "@/API/GameService";
import RequirementsList from "@/components/SystemRequirements/SystemRequirements";
import { Button } from "@/UI/Button/Button";

import { useParams } from 'react-router-dom';
import styles from './GameDetails.module.css';

const GameDetails = () => {
  const [game, setGame] = useState<IGameCard | null>(null);
  const [showRecommended, setShowRecommended] = useState(false);
  const { gameId } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await GameService.getGameById(Number(gameId));
        console.log(data)
        setGame(data);
      } catch (error) {
        console.log("Ошибка при получении игр:", error);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  if (!game) {
    return <div>Игра не найдена</div>;
  }

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.gameTitle}>{game.name}</h1>

      <div className={styles.gameContent}>
        <div className={styles.imageSection}>
          <img className={styles.gameImage} src={game.img_path} alt={game.name} />
        </div>

        <div className={styles.infoSection}>
          <p className={styles.description}>{game.gameInfo?.description}</p>
          <div className={styles.buttonContainer}>
            <Button>Купить за {game.price}</Button>
            <button className={styles.priceButton}>Добавить в корзину</button>
          </div>

          <div className={styles.requirementsToggle}>
            <button
              className={`${styles.toggleButton} ${
                !showRecommended ? styles.active : ""
              }`}
              onClick={() => setShowRecommended(false)}
            >
              Минимальные
            </button>
            <button
              className={`${styles.toggleButton} ${
                showRecommended ? styles.active : ""
              }`}
              onClick={() => setShowRecommended(true)}
            >
              Рекомендованные
            </button>
          </div>

          {showRecommended ? (
            <RequirementsList
              requirements={game.systemReqMax}
              title="Рекомендованные системные требования"
            />
          ) : (
            <RequirementsList
              requirements={game.systemReqMin}
              title="Минимальные системные требования"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails; 