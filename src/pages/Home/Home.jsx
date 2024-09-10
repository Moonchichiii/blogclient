import React from 'react';
import styles from './Home.module.css';

const Home = () => (
    <div className={styles.home}>
        <h1 className={styles.title}>Welcome to BlogClient</h1>
        <p className={styles.intro}>
            BlogClient is a platform where creativity meets technology. Explore our blog for the latest articles on 
            software development, design trends, and much more.
        </p>
        <p className={styles.callToAction}>
            Ready to dive in? Check out our blog posts and join the conversation!
        </p>
        <div className={styles.buttons}>
            <button className={styles.blogButton}>Explore Blog</button>
            <button className={styles.aboutButton}>Learn More About Us</button>
        </div>
    </div>
);

export default Home;