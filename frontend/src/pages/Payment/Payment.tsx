import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatternFormat } from "react-number-format";
import styles from "./Payment.module.css";
import OrderService from "@/API/OrderService";
import BasketService from "@/API/BasketService";
import { IBasketItem } from "@/interfaces/basket";
import axios from "axios";
import { API_URL } from "@/constants";
import { IGame } from "@/interfaces/game";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

const OrderSummary: React.FC = () => {
  const [items, setItems] = useState<IBasketItem[]>([]);
  const [games, setGames] = useState<Record<number, IGame>>({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        setIsLoading(true);
        const sessionId = localStorage.getItem("session_id") || "test-session";
        const basketItems = await BasketService.getBasket(sessionId);
        setItems(basketItems);

        // Загружаем информацию об играх
        const gamePromises = basketItems.map(item => 
          axios.get<IGame>(`${API_URL}/games/${item.game_id}`)
            .then(response => response.data)
            .catch(error => {
              console.error(`Ошибка при загрузке игры ${item.game_id}:`, error);
              return null;
            })
        );

        const gamesData = await Promise.all(gamePromises);
        const gamesMap = gamesData.reduce((acc, game, index) => {
          if (game) {
            acc[basketItems[index].game_id] = game;
          }
          return acc;
        }, {} as Record<number, IGame>);

        setGames(gamesMap);

        // Обновляем общую сумму с учетом цен игр
        const totalAmount = basketItems.reduce((sum, item) => {
          const gamePrice = gamesMap[item.game_id]?.price || 0;
          return sum + gamePrice * item.quantity;
        }, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasket();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.orderSummary}>
        <h3 className={styles.summaryTitle}>Ваш заказ</h3>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.orderSummary}>
        <h3 className={styles.summaryTitle}>Ваш заказ</h3>
        <div className={styles.emptyCart}>Корзина пуста</div>
      </div>
    );
  }

  return (
    <div className={styles.orderSummary}>
      <h3 className={styles.summaryTitle}>Ваш заказ</h3>
      <div className={styles.itemsList}>
        {items.map((item) => {
          const game = games[item.game_id];
          return (
            <div key={item.id} className={styles.orderItem}>
              <span className={styles.itemName}>
                {game?.name || `Игра #${item.game_id}`}
              </span>
              <span className={styles.itemPrice}>
                {game?.price ? `${game.price} ₽` : 'Цена не указана'}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.total}>
        <span>Итого:</span>
        <span>{total} ₽</span>
      </div>
    </div>
  );
};

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [basketItems, setBasketItems] = useState<IBasketItem[]>([]);

  useEffect(() => {
    const fetchBasket = async () => {
      const sessionId = localStorage.getItem("session_id") || "test-session";
      const items = await BasketService.getBasket(sessionId);
      setBasketItems(items);
    };

    fetchBasket();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Номер карты должен содержать 16 цифр";
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Введите имя держателя карты";
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      console.log("Неверный формат:", formData.expiryDate);
      newErrors.expiryDate = "Неверный формат срока действия";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      console.log("Проверка срока:", {
        month,
        year,
        currentYear,
        currentMonth,
        parsedMonth: parseInt(month),
        parsedYear: parseInt(year),
      });

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Неверный месяц";
      } else if (parseInt(year) < currentYear) {
        newErrors.expiryDate = "Срок действия карты истек";
      } else if (
        parseInt(year) === currentYear &&
        parseInt(month) < currentMonth
      ) {
        newErrors.expiryDate = "Срок действия карты истек";
      }
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV должен содержать 3 цифры";
    }

    if (!formData.email) {
      newErrors.email = "Введите email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Неверный формат email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const sessionId = localStorage.getItem("session_id") || "test-session";
      
      console.log('Создание заказа для email:', formData.email);

      const order = await OrderService.createOrder({
        email: formData.email,
        sessionId: sessionId
      });

      if (order) {
        await OrderService.confirmOrder(order.id);
        navigate("/payment-success");
      }
    } catch (error) {
      console.error("Ошибка при обработке платежа:", error);
      setErrors({ cardNumber: "Ошибка при обработке платежа" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentWrapper}>
        <OrderSummary />
        <div className={styles.paymentCard}>
          <h2 className={styles.title}>Оплата заказа</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email для получения ключей</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className={styles.input}
                placeholder="your@email.com"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Номер карты</label>
              <PatternFormat
                format="#### #### #### ####"
                mask="_"
                value={formData.cardNumber}
                onValueChange={(values) => {
                  setFormData((prev) => ({
                    ...prev,
                    cardNumber: values.value,
                  }));
                }}
                className={styles.input}
                placeholder="0000 0000 0000 0000"
              />
              {errors.cardNumber && (
                <span className={styles.error}>{errors.cardNumber}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cardHolder">Имя держателя карты</label>
              <input
                type="text"
                id="cardHolder"
                value={formData.cardHolder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cardHolder: e.target.value.toUpperCase(),
                  }))
                }
                className={styles.input}
                placeholder="IVAN IVANOV"
              />
              {errors.cardHolder && (
                <span className={styles.error}>{errors.cardHolder}</span>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Срок действия</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 4);
                    }
                    setFormData((prev) => ({
                      ...prev,
                      expiryDate: value,
                    }));
                  }}
                  className={styles.input}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <span className={styles.error}>{errors.expiryDate}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <PatternFormat
                  format="###"
                  mask="_"
                  value={formData.cvv}
                  onValueChange={(values) => {
                    setFormData((prev) => ({
                      ...prev,
                      cvv: values.value,
                    }));
                  }}
                  className={styles.input}
                  placeholder="123"
                />
                {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isProcessing}
            >
              {isProcessing ? "Обработка..." : "Оплатить"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
