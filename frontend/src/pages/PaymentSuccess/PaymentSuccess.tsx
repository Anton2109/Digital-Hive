import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.icon}>✓</div>
        <h2 className={styles.title}>Оплата прошла успешно!</h2>
        <p className={styles.message}>
          Спасибо за ваш заказ! Ключи доступа будут отправлены на указанный email.
        </p>
        <button
          className={styles.button}
          onClick={() => navigate("/")}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 