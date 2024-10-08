import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Edit, ArrowRight } from 'lucide-react';
import styles from './About.module.css';

const AboutPage = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.aboutHeader}>
        <h1 className={styles.aboutTitle}>About TheBlogClient</h1>
      </header>

      <section className={styles.aboutContent}>
        <div className={styles.aboutText}>
          <h2>Welcome to TheBlogClient</h2>
          <p>
            TheBlogClient is a modern, React-based blogging platform designed to showcase the power of 
            React Query and clean, efficient code. Our goal is to provide a seamless experience for both 
            readers and writers, with a focus on performance and user experience.
          </p>
          <p>
            Whether you're a developer looking to explore React Query implementations or a content creator 
            seeking a reliable platform, TheBlogClient offers a robust solution with features like infinite 
            scrolling, optimistic updates, and real-time content management.
          </p>
        </div>
        <div className={styles.aboutImageContainer}>
          <img src="src/assets/images/aboutside.png" alt="TheBlogClient Community" className={styles.aboutImage} />
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2>Key Features</h2>
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <Globe className={styles.icon} />
            <h3>React Query Integration</h3>
            <p>Efficient data fetching and state management for a smooth user experience</p>
          </div>
          <div className={styles.featureItem}>
            <Users className={styles.icon} />
            <h3>User Authentication</h3>
            <p>Secure login and registration system with JWT token management</p>
          </div>
          <div className={styles.featureItem}>
            <Edit className={styles.icon} />
            <h3>Content Management</h3>
            <p>Create, edit, and manage blog posts with ease</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Get Started with TheBlogClient</h2>
        <p>Experience the power of modern web development with our React-based blogging platform.</p>
        <Link to="/signup" className={styles.ctaButton}>
          Join Now <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;