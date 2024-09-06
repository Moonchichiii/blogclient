import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => (
  <div className={styles.landing}>
    <h1>Welcome to Our Blog</h1>
    <Link to="/home" className={styles.link}>Enter Site</Link>
  </div>
);

export default Landing;
