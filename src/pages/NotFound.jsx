import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! Looks like this page took a wrong turn at Albuquerque.</p>
      <img 
        src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif" 
        alt="Confused Travolta" 
        className={styles.funnyGif}
      />
      <Link to="/" className={styles.returnButton}>
        Take Me Back to Kansas
      </Link>
    </div>
  );
};

export default NotFound;