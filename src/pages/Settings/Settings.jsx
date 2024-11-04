import React from 'react';
import ProfileSection from '../../features/Settings/components/ProfileSection';
import SecuritySection from '../../features/Settings/components/SecuritySection';
import NotificationSection from '../../features/Settings/components/NotificationSection.';
import DangerZoneSection from '../../features/Settings/components/DangerZoneSection';
import styles from './Settings.module.css';

const Settings = () => {
  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.pageTitle}>Account Settings</h1>
      <div className={styles.settingsGrid}>
        <ProfileSection />
        <SecuritySection />
        <NotificationSection />
        <DangerZoneSection />
      </div>
    </div>
  );
};

export default Settings;
