import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import BottomNav from './BottomNav'; // Import the new BottomNav component
import styles from './Layout.module.css';

const Layout = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  
  // Conditionally hide Navbar and Footer on the Landing page
  const hideLayout = location.pathname === '/';

  return (
    <div className={styles.layout}>
      {!hideLayout && <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      <main className={styles.outletContainer}>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
      <BottomNav /> {/* Add the BottomNav here to appear consistently */}
    </div>
  );
};

export default Layout;
