import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ message }) => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
    {message && <p>{message}</p>}
  </div>
);

export default Spinner;
