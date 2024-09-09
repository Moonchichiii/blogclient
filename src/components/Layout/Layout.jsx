import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children, onOpenModal }) => {
  return (
    <div className={styles.layout}>
      <Navbar onOpenModal={onOpenModal} />
      <main className={styles.main}>
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;