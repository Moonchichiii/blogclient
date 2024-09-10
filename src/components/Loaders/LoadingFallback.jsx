import React from 'react';
import styles from './LoadingFallback.module.css';

const LoadingFallback = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    <p>Loading...</p>
  </div>
);

export default LoadingFallback;