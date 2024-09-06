import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome, {user?.profile_name}</h1>
      <p className={styles.info}>Email: {user?.email}</p>
      <p className={styles.info}>Bio: {user?.profile?.bio}</p>
      <p className={styles.info}>Location: {user?.profile?.location}</p>
      <button className={styles.logoutButton}>Logout</button>
    </div>
  );
};

export default Dashboard;