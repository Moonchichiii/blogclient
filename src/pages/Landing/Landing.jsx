import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.landing} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.overlay}></div> 
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.titleWord}>The</span>
          <span className={styles.titleWord}>Blog</span>
          <span className={styles.titleWord}>Client</span>
        </h1>
        <p className={styles.subtitle}>Explore. Create. Connect.</p>
        <button onClick={() => navigate('/home')} className={styles.ctaButton}>
          Start Your Journey
        </button>
      </div>
      <div className={styles.backgroundAnimation}></div>
    </div>
  );
};

export default Landing;
