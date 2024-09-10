import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <h1>Welcome to Our Blog</h1>
      <button onClick={() => navigate('/home')} className={styles.link}>Enter Site</button>
    </div>
  );
};

export default Landing;