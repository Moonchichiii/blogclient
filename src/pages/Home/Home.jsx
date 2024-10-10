import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <main className={styles.home}>
      <h1 className={styles.title}>Welcome to BlogClient</h1>
      <div id='top'></div>

      <p className={styles.intro}>
        BlogClient is a platform where creativity meets technology. Explore our blog for the latest articles on 
        software development, design trends, and much more.
      </p>
      <p className={styles.callToAction}>
        Ready to dive in? Check out our blog posts and join the conversation!
      </p>
      <div className={styles.buttons}>
        <button className={styles.button}>Explore Blog</button>
        <button className={styles.button}>Learn More About Us</button>
      </div>
    </main>
  );
};

export default Home;