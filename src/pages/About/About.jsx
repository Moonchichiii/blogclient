import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const AboutPage = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.aboutHeader}>
        <h1 className={styles.aboutTitle}>About The Blog</h1>
      </header>
      
      <section className={styles.aboutContent}>
        <div className={styles.aboutText}>
          <h2>Welcome to The Blog</h2>
          <p>
            At The Blog, we believe in the power of diverse ideas and open discussions. 
            Our platform is a space where writers and readers come together to explore 
            a wide range of topics, from the everyday to the extraordinary.
          </p>
          <p>
            Whether you're passionate about technology, fascinated by culture, or curious 
            about the world around us, you'll find content that speaks to your interests. 
            Our goal is to foster a community where ideas can be shared, debated, and evolved.
          </p>
        </div>
        <div className={styles.aboutImageContainer}>
          <img src="src/assets/images/aboutside.png" alt="The Blog Community" className={styles.aboutImage} />
        </div>
      </section>
      
      <section className={styles.featuresSection}>
        <h2>What We Offer</h2>
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <i className={`${styles.icon} ${styles.diversityIcon}`}></i>
            <h3>Diverse Content</h3>
            <p>Articles on a wide range of topics to satisfy every curiosity</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`${styles.icon} ${styles.communityIcon}`}></i>
            <h3>Engaged Community</h3>
            <p>A space for readers and writers to connect and discuss ideas</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`${styles.icon} ${styles.qualityIcon}`}></i>
            <h3>Quality Writing</h3>
            <p>Thoughtful, well-researched articles from passionate writers</p>
          </div>
        </div>
      </section>
      
      <section className={styles.ctaSection}>
        <h2>Join Our Community</h2>
        <p>Become a part of The Blog and start sharing your thoughts with the world.</p>
        <Link to="/signup" className={styles.ctaButton}>Start Writing</Link>
      </section>
    </div>
  );
};

export default AboutPage;