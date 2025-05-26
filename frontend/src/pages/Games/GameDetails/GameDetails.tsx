import { useState, useEffect } from "react";
import { IGame } from "@/interfaces/game";
import GameService from "@/API/GameService";
import RequirementsList from "@/components/SystemRequirements/SystemRequirements";
import { Button } from "@/UI/Button/Button";
import { useParams } from "react-router-dom";
import styles from "./GameDetails.module.css";
import axios from "axios";
import { API_URL } from "@/constants";

const GameDetails = () => {
  const [game, setGame] = useState<IGame | null>(null);
  const [showRecommended, setShowRecommended] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { gameId } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await GameService.getGameById(Number(gameId));
        if (!data) {
          throw new Error("Игра не найдена");
        }
        setGame(data as IGame);
      } catch (error) {
        console.error("Ошибка при получении игры:", error);
        setError(error instanceof Error ? error.message : "Произошла ошибка при загрузке игры");
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const handleAddToCart = async () => {
    if (!game) return;
    
    try {
      const sessionId = localStorage.getItem("session_id") || "test-session";
      await axios.post(
        `${API_URL}/basket`,
        {
          session_id: sessionId,
          game_id: game.id,
          quantity: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Товар добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      alert("Не удалось добавить товар в корзину");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!game) {
    return <div className={styles.error}>Игра не найдена</div>;
  }

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.gameTitle}>{game.name}</h1>

      <div className={styles.gameContent}>
        <div className={styles.imageSection}>
          <img
            className={styles.gameImage}
            src={game.img_path}
            alt={game.name}
          />
        </div>

        <div className={styles.infoSection}>
          <p className={styles.description}>
            {game.gameInfo?.description || "Описание отсутствует"}
          </p>
          <div className={styles.buttonContainer}>
            <Button>Купить за {game.price} ₽</Button>
            <button 
              className={styles.priceButton} 
              onClick={handleAddToCart}
              disabled={!game}
            >
              Добавить в корзину
            </button>
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

          {showRecommended && game.systemReqMax ? (
            <RequirementsList
              requirements={game.systemReqMax}
              title="Рекомендованные системные требования"
            />
          ) : game.systemReqMin ? (
            <RequirementsList
              requirements={game.systemReqMin}
              title="Минимальные системные требования"
            />
          ) : (
            <div className={styles.noRequirements}>
              Системные требования отсутствуют
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
