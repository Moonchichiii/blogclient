import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300); 

    return () => clearTimeout(timer);
  }, [duration]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
      {message}
    </div>
  );
};

export default Toast;