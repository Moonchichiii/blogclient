import React from 'react';
import { useSettings } from '../hooks/useSettings';
import styles from '../../../pages/Settings/Settings.module.css';

const NotificationSection = () => {
    const { handleNotificationUpdate, notificationSettings } = useSettings();
  
    return (
        <div className={styles.notificationSection}>
          <div className={styles.sectionHeader}>
            <h2>Notifications</h2>
          </div>
          <div className={styles.notificationOptions}>
            <div className={styles.notificationOption}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notificationSettings?.emailNotifications || false}
                  onChange={() => handleNotificationUpdate('emailNotifications')}
                />
                <span className={styles.slider}></span>
              </label>
              <span>Email Notifications</span>
            </div>
          <div className={styles.notificationOption}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={notificationSettings?.commentNotifications || false}
                onChange={() => handleNotificationUpdate('commentNotifications')}
              />
              <span className={styles.slider}></span>
            </label>
            <span>Comment Notifications</span>
          </div>
          <div className={styles.notificationOption}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={notificationSettings?.newFollowerNotifications || false}
                onChange={() => handleNotificationUpdate('newFollowerNotifications')}
              />
              <span className={styles.slider}></span>
            </label>
            <span>New Follower Notifications</span>
          </div>
        </div>
      </div>
    );
  };
  

export default NotificationSection;
