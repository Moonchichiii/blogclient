import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  PenTool,
  LogIn,
  LogOut,
  User,
  Sun,
  Moon
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
          staleTime: 5 * 60 * 1000
        });
      }
    } catch (error) {
      console.error("Error prefetching posts:", error);
    }
  };

  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/">
            TheBlog<span>Client</span>
          </Link>
        </div>

        <div className={styles.menu}>
          <Link to="/home">
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link to="/about">
            <Info size={24} />
            <span>About</span>
          </Link>
          <Link to="/blog" onMouseEnter={prefetchPosts}>
            <PenTool size={24} />
            <span>Blog</span>
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard">
              <User size={24} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className={styles.buttons}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleOpenModal("signin")}
                className={styles.authButton}
              >
                <LogIn size={24} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => handleOpenModal("signup")}
                className={styles.authButton}
              >
                <LogIn size={24} />
                <span>Sign Up</span>
              </button>
            </>
          ) : (
            <>
              {windowWidth > 768 && user && (
                <div className={styles.profileInfo}>
                  <img
                    src={user?.profile?.image || "/default-profile.png"}
                    alt={`${user.profile_name}'s profile`}
                    className={styles.profileImage}
                  />
                  <span>{user.profile_name}</span>
                </div>
              )}
              <button onClick={handleLogout} className={styles.logoutButton}>
                <div className={styles.sign}>
                  <LogOut size={24} />
                </div>
                <span className={styles.text}>Logout</span>
              </button>
            </>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={modalView}
      />
    </div>
  );
};

export default Navbar;
