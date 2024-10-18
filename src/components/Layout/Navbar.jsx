import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Sun, Moon, Menu, BookOpen, Bell, X, User } from "lucide-react";
import AuthModal from "../../features/Accounts/AuthModal";
import { useAuth } from "../../features/Accounts/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { postEndpoints } from "../../api/endpoints";
import AuthButtons from "../buttons/AuthButtons";
import styles from "./Navbar.module.css";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("signin");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: 'Home', icon: Home, link: '/' },
    { name: 'Blog', icon: BookOpen, link: '/blog' },
    { name: 'Dashboard', icon: Bell, link: '/dashboard', authRequired: true },
    { name: 'Settings', icon: User, link: '/settings', authRequired: true },
  ];

  return (
    <div className={styles.navbarContainer}>
      {windowWidth > 768 ? (
        <nav className={styles.desktopNav}>
          <h1 className={styles.logo}>TheBlog<span>Client</span></h1>
          <ul>
            {navItems.map((item) => (
              (!item.authRequired || isAuthenticated) && (
                <li key={item.name}><Link to={item.link}>{item.name}</Link></li>
              )
            ))}
            <li>
              <AuthButtons
                isAuthenticated={isAuthenticated}
                onSignIn={() => handleOpenModal("signin")}
                onSignUp={() => handleOpenModal("signup")}
                onLogout={handleLogout}
              />
            </li>
            <li>
              <div className={styles.themeToggle} onClick={toggleTheme}>
                {isDarkMode ? <Sun size={20} className={styles.sun} /> : <Moon size={20} className={styles.moon} />}
              </div>
            </li>
          </ul>
        </nav>
      ) : (
        <>
          <nav className={styles.topNav}>
            <button className={styles.hamburgerMenu} onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className={styles.mobileLogo}>TheBlog</h1>
            <div className={styles.rightButtons}>
              <AuthButtons
                isAuthenticated={isAuthenticated}
                onSignIn={() => handleOpenModal("signin")}
                onSignUp={() => handleOpenModal("signup")}
                onLogout={handleLogout}
              />
              <div className={styles.themeToggle} onClick={toggleTheme}>
                {isDarkMode ? <Sun size={20} className={styles.sun} /> : <Moon size={20} className={styles.moon} />}
              </div>
            </div>
          </nav>
          <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <button className={styles.closeButton} onClick={toggleSidebar}>
              <X size={24} />
            </button>
            <ul>
              {navItems.map((item) => (
                (!item.authRequired || isAuthenticated) && (
                  <li key={item.name}><Link to={item.link} onClick={toggleSidebar}>{item.name}</Link></li>
                )
              ))}
            </ul>
          </div>
          <nav className={styles.bottomNav}>
            <div className={styles.navItems}>
              {navItems.map((item) => (
                (!item.authRequired || isAuthenticated) && (
                  <Link key={item.name} to={item.link} className={styles.navItem}>
                    <item.icon size={24} />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
          </nav>
        </>
      )}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={modalView}
      />
    </div>
  );
};

export default Navbar;