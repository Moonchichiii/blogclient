import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        
      </nav>
      <header className={styles.header}>
        <h1>Your Blog Title</h1>
      </header>
      <main className={styles.main}>
        {children}
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About Us</h3>
            <p>Your blog description here.</p>
          </div>
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3>Contact</h3>
            <p>Email: your@email.com</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Your Blog Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;