import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import styles from './Layout.module.css';

const Layout = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  
  
  const hideLayout = location.pathname === '/';

  return (
    <div className={styles.layout}>
      {!hideLayout && <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      <main className={styles.outletContainer}>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
      <BottomNav /> 
    </div>
  );
};

export default Layout;
