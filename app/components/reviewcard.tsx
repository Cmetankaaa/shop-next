"use client";
import React from 'react';
import styles from './reviewcard.module.css'; 

interface Review {
  id: number;
  text: string;
}

const reviewcard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className={styles.card}>
      <div 
        className={styles.content} 
        dangerouslySetInnerHTML={{ __html: review.text }} 
      />
    </div>
  );
};

export default reviewcard;