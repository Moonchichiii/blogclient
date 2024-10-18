import React from 'react';
import { Home, BookOpen, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: Home, link: '/' },
    { name: 'Categories', icon: BookOpen, link: '/categories' },
    { name: 'Notifications', icon: Bell, link: '/notifications' },
    { name: 'Profile', icon: User, link: '/profile' },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navItems}>
        {navItems.map((item) => (
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
