import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  LogIn,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import styles from "./Navbar.module.css";
import AuthModal from "../../features/Accounts/AuthModal";
import { useAuth } from "../../features/Accounts/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { postEndpoints } from "../../api/endpoints";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("signin");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  const prefetchPosts = async () => {
    try {
      const cachedPosts = queryClient.getQueryData(["posts"]);
      if (!cachedPosts) {
        await queryClient.prefetchQuery({
          queryKey: ["posts"],
          queryFn: postEndpoints.getPosts,
          staleTime: 5 * 60 * 1000,
        });
      }
    } catch (error) {
      console.error("Error prefetching posts:", error);
    }
  };

  return (
    <div className={styles.navbarContainer}>
      <div id="top"></div>
      
      {/* Top Navbar */}
      <nav className={styles.topNav}>
        {/* Hamburger Menu on the left */}
        <button className={styles.hamburgerMenu}>
          <Menu size={24} />
        </button>

        <div className={styles.rightButtons}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {isAuthenticated && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              <div className={styles.sign}>
                <LogOut size={24} />
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* Bottom Navbar for non-authenticated users */}
      {!isAuthenticated && windowWidth <= 768 && (
        <nav className={styles.bottomNav}>
          <div className={styles.navItems}>
            <button
              className={styles.navItem}
              onClick={() => handleOpenModal("signin")}
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </button>
            <button
              className={styles.navItem}
              onClick={() => handleOpenModal("signup")}
            >
              <LogIn size={20} />
              <span>Sign Up</span>
            </button>
          </div>
        </nav>
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
