import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import { getNavigationConfig } from './NavigationConfig';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const { mobileNav } = getNavigationConfig(isAuthenticated);

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navItems}>
        {mobileNav.map((item) => (
          <Link key={item.name} to={item.link} className={styles.navItem}>
            <item.icon size={24} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
