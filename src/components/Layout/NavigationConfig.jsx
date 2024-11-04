import { Home, BookOpen, FileText, Layout, Settings, Info } from 'lucide-react';

export const getNavigationConfig = (isAuthenticated) => {
  const nonAuthItems = [
    { name: 'Home', icon: Home, link: '/home' },
    { name: 'About', icon: Info, link: '/about' },
    { name: 'Blog', icon: BookOpen, link: '/blog' },
  ];

  const authItems = [
    { name: 'Home', icon: Home, link: '/home' },
    { name: 'My Posts', icon: FileText, link: '/my-posts', authRequired: true },
    { name: 'Dashboard', icon: Layout, link: '/dashboard', authRequired: true },
    { name: 'Blog', icon: BookOpen, link: '/blog' },
    { name: 'Settings', icon: Settings, link: '/settings', authRequired: true },
  ];

  const mobileAuthItems = [
    { name: 'My Posts', icon: FileText, link: '/my-posts' },
    { name: 'Dashboard', icon: Layout, link: '/dashboard' },
    { name: 'Blog', icon: BookOpen, link: '/blog' },
    { name: 'Settings', icon: Settings, link: '/settings' },
  ];

  return {
    mainNav: isAuthenticated ? authItems : nonAuthItems,
    mobileNav: isAuthenticated ? mobileAuthItems : nonAuthItems,
  };
};