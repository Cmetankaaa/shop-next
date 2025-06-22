"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cart from './Cart';
import ReviewCard from './reviewcard';
import ProductCard from './ProductCard';
import styles from '../page.module.css';

interface Review {
  id: number;
  text: string;
}

interface Product {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

const MainContent: React.FC<{ 
  reviews: Review[]; 
  products: Product[] 
}> = ({ reviews, products }) => {
  // Состояние корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Восстановление корзины из localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Ошибка восстановления корзины:', e);
      }
    }
  }, []);

  // Сохранение корзины в localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  // Обработчик изменения количества
  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    setCartItems(prevItems => {
      // Найдем товар в списке продуктов
      const product = products.find(p => p.id === productId);
      if (!product) return prevItems;
      
      // Если количество 0 - удаляем товар
      if (quantity === 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      
      const existingItemIndex = prevItems.findIndex(item => item.id === productId);
      
      if (existingItemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = { 
          ...newItems[existingItemIndex], 
          quantity 
        };
        return newItems;
      }
      
      // Добавляем новый товар
      return [...prevItems, { 
        id: productId, 
        title: product.title, 
        price: product.price, 
        quantity 
      }];
    });
  }, [products]);

  // Расчет общей суммы
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Получение количества для конкретного товара
  const getProductQuantity = (productId: number) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Функция очистки корзины после успешного заказа
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  return (
    <>
      <div className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Отзывы наших клиентов</h2>
        
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>Отзывы не найдены</p>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

        <Cart 
          cartItems={cartItems}
          cartTotal={cartTotal}
          onOrderSuccess={clearCart} 
        />
      
      <div className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Наши товары</h2>
        
        {products.length === 0 ? (
          <p className={styles.noProducts}>Товары не найдены</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                quantity={getProductQuantity(product.id)}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MainContent;