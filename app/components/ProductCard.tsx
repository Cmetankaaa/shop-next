"use client";

import React, { useState } from 'react';
import styles from './ProductCard.module.css';

interface Product {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  quantity,
  onQuantityChange 
}) => {
  const handleAddToCart = () => {
    onQuantityChange(product.id, 1);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(0, quantity + value);
    onQuantityChange(product.id, newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onQuantityChange(product.id, value);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={product.image_url} 
          alt={product.title} 
          className={styles.image}
        />
      </div>
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.description}>{product.description}</p>
      <div className={styles.price}>{product.price} руб.</div>
      
      {quantity === 0 ? (
        <button 
          className={styles.buyButton}
          onClick={handleAddToCart}
        >
          Заказать
        </button>
      ) : (
        <div className={styles.quantityContainer}>
          <button 
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(-1)}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className={styles.quantityInput}
            min="0"
          />
          <button 
            className={styles.quantityButton}
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;