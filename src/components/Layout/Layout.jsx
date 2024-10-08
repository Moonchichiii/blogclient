import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkMode');
      document.body.classList.remove('lightMode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('lightMode');
      document.body.classList.remove('darkMode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

  return (
    <div className={styles.layout}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className={styles.main}>
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
