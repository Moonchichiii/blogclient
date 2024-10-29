import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Info, FileText, Layout, Users, Settings, User } from 'lucide-react';
import { useAuth } from '../../features/Accounts/hooks/useAuth'; // Adjust the import path as needed
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();

  const nonAuthItems = [
    { name: 'Home', icon: Home, link: '/home' },
    { name: 'About', icon: Info, link: '/about' },
    { name: 'Categories', icon: BookOpen, link: '/categories' },
    { name: 'Blog', icon: FileText, link: '/blog' },
  ];

  const authItems = [
    { name: 'My Posts', icon: FileText, link: '/my-posts' },
    { name: 'Dashboard', icon: Layout, link: '/dashboard' },
    { name: 'Followers', icon: Users, link: '/followers' },
    { name: 'Settings', icon: Settings, link: '/settings' },
  ];

  const navItems = isAuthenticated ? authItems : nonAuthItems;

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