import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/Accounts/authSlice";
import { Sun, Moon } from "lucide-react";
import styles from "./Navbar.module.css";
import AuthModal from "../../features/Accounts/AuthModal";
import queryClient from "../../api/queryClient";
import { fetchPosts } from "../../features/Posts/postSlice";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/">TheBlog<span>Client</span></Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link 
  to="/blog" 
  onMouseEnter={() => queryClient.prefetchQuery(['posts'], fetchPosts)}
>
  Blog
</Link>

          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        </div>
        <div className={styles.buttons}>
          {!isAuthenticated ? (
            <>
              <button onClick={() => handleOpenModal("signin")} className={styles.authButton}>Sign In</button>
              <button onClick={() => handleOpenModal("signup")} className={styles.authButton}>Sign Up</button>
            </>
          ) : (
            <button onClick={handleLogout} className={styles.authButton}>Logout</button>
          )}
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <label className={styles.burger}>
          <input type="checkbox" checked={isMenuOpen} onChange={toggleMenu} />
          <span></span>
          <span></span>
          <span></span>
        </label>
      </nav>

      {isMenuOpen && (
        <div className={styles.menuContainer}>
          <Link to="/home" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link 
  to="/blog" 
  onMouseEnter={() => queryClient.prefetchQuery(['posts'], fetchPosts)}
>
  Blog
</Link>
          {isAuthenticated && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
        </div>
      )}

      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} initialView={modalView} />
    </div>
  );
};

export default Navbar;
