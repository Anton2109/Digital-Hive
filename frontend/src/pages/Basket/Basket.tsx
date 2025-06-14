import { useState, useEffect } from "react";
import styles from "./Basket.module.css";
import { IBasketItem } from "@/interfaces/basket";
import { IGame } from "@/interfaces/game";
import GameService from "@/API/GameService";
import BasketService from "@/API/BasketService";
import { Button } from "@/UI/Button/Button";
import { useNavigate } from "react-router-dom";

const MAX_QUANTITY = 10;

const Basket = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<IBasketItem[]>([]);
  const [games, setGames] = useState<{ [key: number]: IGame }>({});
  const sessionId = localStorage.getItem("session_id") || "test-session";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBasket = async () => {
    try {
      const data = await BasketService.getBasket(sessionId);
      setItems(data);
      
      const gamesData: { [key: number]: IGame } = {};
      for (const item of data) {
        const gameData = await GameService.getGameById(item.game_id);
        if (gameData) {
          gamesData[item.game_id] = gameData as IGame;
        }
      }
      setGames(gamesData);
    } catch (error) {
      console.error("Ошибка при загрузке корзины:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await BasketService.removeItem(id);
      fetchBasket();
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    if (newQuantity > MAX_QUANTITY) {
      return;
    }

    try {
      const success = await BasketService.updateQuantity(id, newQuantity);
      if (success) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        console.error('Не удалось обновить количество товара');
        setError('Не удалось обновить количество товара');
      }
    } catch (error) {
      console.error('Ошибка при обновлении количества:', error);
      setError('Ошибка при обновлении количества товара');
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      for (const item of items) {
        await BasketService.updateQuantity(item.id, item.quantity);
      }

      const basketData = items.map(item => ({
        game_id: item.game_id,
        quantity: item.quantity,
        price: games[item.game_id]?.price || 0
      }));
      localStorage.setItem('checkout_data', JSON.stringify(basketData));

      navigate('/payment');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setError('Не удалось оформить заказ');
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const game = games[item.game_id];
      return total + (game?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className={styles.basket}>
      <h2 className={styles.title}>Ваша корзина</h2>
      
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : items.length === 0 ? (
        <div className={styles.emptyMessage}>Корзина пуста</div>
      ) : (
        <>
          <div className={styles.itemsList}>
            {items.map((item) => {
              const game = games[item.game_id];
              if (!game) return null;

              return (
                <div key={item.id} className={styles.basketItem}>
                  <div className={styles.itemImage}>
                    <img src={game.img_path} alt={game.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{game.name}</h3>
                    <p className={styles.itemPrice}>{game.price} ₽</p>
                  </div>
                  <div className={styles.itemQuantity}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={`${styles.quantityButton} ${item.quantity >= MAX_QUANTITY ? styles.quantityButtonDisabled : ''}`}
                      disabled={item.quantity >= MAX_QUANTITY}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    {game.price * item.quantity} ₽
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          <div className={styles.basketFooter}>
            <div className={styles.total}>
              Итого: <span>{calculateTotal()} ₽</span>
            </div>
            <Button 
              className={styles.checkoutButton}
              onClick={handleCheckout}
            >
              Оформить заказ
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Basket;
