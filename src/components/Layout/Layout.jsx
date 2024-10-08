import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children, isDarkMode, toggleTheme }) => {
  const location = useLocation();
  
  // Only render Navbar and Footer if not on the Landing page
  const hideLayout = location.pathname === '/';

  return (
    <div className={styles.layout}>
      {!hideLayout && <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      <main className={styles.main}>
        {children}
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default Layout;
