"use client";

import React, { useState } from 'react';
import styles from './Cart.module.css';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  cartTotal: number;
  onOrderSuccess: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  cartItems = [], 
  cartTotal,
  onOrderSuccess
}) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formattedValue = '+7';
    
    if (cleaned.length > 1) {
      const rest = cleaned.slice(1);
      const match = rest.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      
      if (match) {
        if (match[1]) formattedValue += `(${match[1]}`;
        if (match[2]) formattedValue += `) ${match[2]}`;
        if (match[3]) formattedValue += `-${match[3]}`;
        if (match[4]) formattedValue += `-${match[4]}`;
      }
    }
    
    return formattedValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setPhoneError(false);
  };

  const isPhoneComplete = () => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11;
  };

  const handleSubmitOrder = async () => {
    if (!isPhoneComplete()) {
      setPhoneError(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const orderData = {
        phone: phone.replace(/\D/g, ''),
        cart: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      };
      const response = await fetch('http://o-complex.com:1337/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при оформлении заказа');
      }
      setShowSuccessPopup(true);
      setTimeout(() => {
        onOrderSuccess();
        setPhone('');
        setShowSuccessPopup(false);
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Добавленные товары</h2>
      
      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Корзина пуста</p>
      ) : (
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.title}</span>
                <div className={styles.quantityInfo}>
                  Количество: <span className={styles.quantity}>{item.quantity}</span>
                </div>
              </div>
              <div className={styles.itemPrice}>
                {item.price * item.quantity} руб.
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.phoneSection}>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7(___) ___-__-__"
          className={`${styles.phoneInput} ${phoneError ? styles.inputError : ''}`}
          disabled={isLoading}
        />
        <button 
          className={styles.orderButton}
          onClick={handleSubmitOrder}
          disabled={isLoading || cartItems.length === 0}
        >
          {isLoading ? 'Отправка...' : 'Заказать'}
        </button>
      </div>
      
      <div className={styles.totalSection}>
        <span>Итого:</span>
        <span className={styles.totalPrice}>{cartTotal} руб.</span>
      </div>
      
      {showSuccessPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.successPopup}>
            <div className={styles.popupContent}>
              <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
              <h3 className={styles.popupTitle}>Заказ оформлен!</h3>
              <p className={styles.popupMessage}>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;