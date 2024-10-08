import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Info, PenTool, LogIn, LogOut, User, Sun, Moon } from "lucide-react"; // Using Lucide icons
import styles from "./Navbar.module.css";
import AuthModal from "../../features/Accounts/AuthModal";
import { useAuth } from "../../features/Accounts/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { postEndpoints } from "../../api/endpoints";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleOpenModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Prefetch posts for better UX
  const prefetchPosts = async () => {
    const cachedPosts = queryClient.getQueryData(["posts"]);
    if (!cachedPosts) {
      await queryClient.prefetchQuery(["posts"], postEndpoints.getPosts);
    }
  };

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.nav}>
      <div className={styles.logo}>
          <Link to="/">TheBlog<span>Client</span></Link>
        </div>
        <div className={styles.menu}>
          <Link to="/home" onClick={closeMenu}>
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link to="/about" onClick={closeMenu}>
            <Info size={24} />
            <span>About</span>
          </Link>
          <Link to="/blog" onClick={closeMenu} onMouseEnter={prefetchPosts}>
            <PenTool size={24} />
            <span>Blog</span>
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" onClick={closeMenu}>
              <User size={24} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className={styles.buttons}>
  <button onClick={toggleTheme} className={styles.themeToggle}>
    {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
  </button>
  
  {!isAuthenticated ? (
    <>
      <button onClick={() => handleOpenModal("signin")} className={styles.authButton}>
        <LogIn size={24} />
        <span>Sign In</span>
      </button>
      <button onClick={() => handleOpenModal("signup")} className={styles.authButton}>
        <LogIn size={24} />
        <span>Sign Up</span>
      </button>
    </>
  ) : (
    <>
      <button onClick={handleLogout} className={styles.authButton}>
        <LogOut size={24} />
        <span>Logout</span>
      </button>
    </>
  )}
</div>

      </nav>

      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} initialView={modalView} />
    </div>
  );
};

export default Navbar;
