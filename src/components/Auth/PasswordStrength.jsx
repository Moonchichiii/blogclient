import React, { useState, useEffect } from 'react';
import styles from './PasswordStrength.module.css';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });

  useEffect(() => {
    const checkRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setRequirements(checkRequirements);
    setStrength(Object.values(checkRequirements).filter(Boolean).length);
  }, [password]);

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthMeter}>
        <div className={styles.strengthBar} style={{ width: `${strength * 25}%` }} />
      </div>
      <ul className={styles.requirementsList}>
        <li className={requirements.length ? styles.met : ''}>At least 8 characters</li>
        <li className={requirements.uppercase ? styles.met : ''}>One uppercase letter</li>
        <li className={requirements.number ? styles.met : ''}>One number</li>
        <li className={requirements.symbol ? styles.met : ''}>One symbol</li>
      </ul>
    </div>
  );
};

export default PasswordStrength;