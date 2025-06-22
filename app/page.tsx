import React from 'react';
import styles from './page.module.css';
import MainContent from './components/MainContent';

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

async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch('http://o-complex.com:1337/reviews', {
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Ошибка загрузки отзывов');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://o-complex.com:1337/products?page=1&page_size=20', {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Ошибка загрузки товаров');
    }
    
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

export default async function Home() {
  const [reviews, products] = await Promise.all([
    getReviews(),
    getProducts()
  ]);

  return (
    <section className={styles.shop}>
      <div className={styles.container}>
        <div className={styles.header}>
          тестовое задание
        </div>
        
        <MainContent reviews={reviews} products={products} />
      </div>
    </section>
  );
}