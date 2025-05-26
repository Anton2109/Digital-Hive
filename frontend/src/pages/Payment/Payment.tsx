import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';
import styles from './Payment.module.css';

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Номер карты должен содержать 16 цифр';
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Введите имя держателя карты';
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Неверный формат срока действия';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Неверный месяц';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Срок действия карты истек';
      }
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV должен содержать 3 цифры';
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/payment/success');
    } catch (error) {
      console.error('Ошибка при обработке платежа:', error);
      setErrors({ cardNumber: 'Ошибка при обработке платежа' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <h2 className={styles.title}>Оплата заказа</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Номер карты</label>
            <PatternFormat
              format="#### #### #### ####"
              mask="_"
              value={formData.cardNumber}
              onValueChange={(values) => {
                setFormData(prev => ({
                  ...prev,
                  cardNumber: values.value
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cardHolder: e.target.value.toUpperCase()
              }))}
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
              <PatternFormat
                format="##/##"
                mask="_"
                value={formData.expiryDate}
                onValueChange={(values) => {
                  setFormData(prev => ({
                    ...prev,
                    expiryDate: values.value
                  }));
                }}
                className={styles.input}
                placeholder="MM/YY"
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
                  setFormData(prev => ({
                    ...prev,
                    cvv: values.value
                  }));
                }}
                className={styles.input}
                placeholder="123"
              />
              {errors.cvv && (
                <span className={styles.error}>{errors.cvv}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isProcessing}
          >
            {isProcessing ? 'Обработка...' : 'Оплатить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment; 