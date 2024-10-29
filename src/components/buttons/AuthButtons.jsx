import React from 'react';
import { LogOut } from 'lucide-react';
import styles from './AuthButtons.module.css';

const AuthButtons = ({ isAuthenticated, onSignIn, onSignUp, onLogout }) => {
  if (isAuthenticated) {
    return (
      <button onClick={onLogout} className={styles.logoutButton}>
        <div className={styles.sign}>
          <LogOut size={30} />
        </div>
        <div className={styles.logoutText}>Logout</div>
      </button>
    );
  } else {
    return (
      <>
        <button onClick={onSignIn} className={styles.authButton}>
          <span className={styles.topKey}></span>
          <span className={styles.text}>Sign In</span>
          <span className={styles.bottomKey1}></span>
          <span className={styles.bottomKey2}></span>
        </button>
        <button onClick={onSignUp} className={styles.authButton}>
          <span className={styles.topKey}></span>
          <span className={styles.text}>Sign Up</span>
          <span className={styles.bottomKey1}></span>
          <span className={styles.bottomKey2}></span>
        </button>
      </>
    );
  }
};

export default AuthButtons;