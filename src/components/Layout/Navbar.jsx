import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, LogOut } from "lucide-react";
import AuthModal from "../../features/Accounts/AuthModal";
import { useAuth } from "../../features/Accounts/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import AuthButtons from "../buttons/AuthButtons";
import NotificationBell from "../../features/Notifications/NotificationsBell";
import { getNavigationConfig } from "./NavigationConfig";
import styles from "./Navbar.module.css";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("signin");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication and navigation
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Extract profile data from the user object
  const profileName = user?.profile_name;
  const profileImage = user?.profile?.image_url;

  // Navigation configuration based on authentication state
  const { mainNav } = getNavigationConfig(isAuthenticated);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open authentication modal
  const handleOpenModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/");
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Render individual navigation items
  const renderNavItem = (item) => (
    <Link
      to={item.link}
      className={styles.navItem}
      onClick={() => setIsSidebarOpen(false)}
    >
      <span>{item.name}</span>
      {item.icon && <item.icon size={20} />}
    </Link>
  );

  // Render authentication buttons for mobile view
  const renderMobileButtons = () =>
    !isAuthenticated && (
      <AuthButtons
        isAuthenticated={false}
        onSignIn={() => handleOpenModal("signin")}
        onSignUp={() => handleOpenModal("signup")}
      />
    );

  return (
    <div className={styles.navbarContainer}>
      {windowWidth > 768 ? (
        // Desktop Navbar
        <nav className={styles.desktopNav}>
          <h1 className={styles.logo}>
            The<span>Blog</span>
          </h1>
          <ul>
            {/* Render navigation items */}
            {mainNav.map(
              (item) =>
                (!item.authRequired || isAuthenticated) && (
                  <li key={item.name}>{renderNavItem(item)}</li>
                )
            )}
            {/* Display notification bell if authenticated */}
            {isAuthenticated && (
              <>
                <li className={styles.notificationItem}>
                  <NotificationBell />
                </li>
                {/* Display user's profile image and name */}
                <li className={styles.profileItem}>
                  <div className={styles.profileContainer}>
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={`${profileName}'s avatar`}
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.profilePlaceholder}>
                        {profileName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className={styles.profileName}>{profileName}</span>
                  </div>
                </li>
              </>
            )}
            {/* Authentication buttons */}
            <li>
              <AuthButtons
                isAuthenticated={isAuthenticated}
                onSignIn={() => handleOpenModal("signin")}
                onSignUp={() => handleOpenModal("signup")}
                onLogout={handleLogout}
              />
            </li>
            {/* Theme toggle button */}
            <li>
              <div className={styles.themeToggle} onClick={toggleTheme}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
            </li>
          </ul>
        </nav>
      ) : (
        // Mobile Navbar
        <>
          <nav className={styles.topNav}>
            <button className={styles.hamburgerMenu} onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className={styles.mobileLogo}>TheBlog</h1>
            <div className={styles.rightButtons}>
              {isAuthenticated && <NotificationBell />}
              {renderMobileButtons()}
              <div className={styles.themeToggle} onClick={toggleTheme}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
            </div>
          </nav>
          <div
            className={`${styles.sidebar} ${
              isSidebarOpen ? styles.sidebarOpen : ""
            }`}
          >
            <button className={styles.closeButton} onClick={toggleSidebar}>
              <X size={24} />
            </button>
            {/* Display user's profile in sidebar if authenticated */}
            {isAuthenticated && (
              <div className={styles.sidebarProfile}>
                <div className={styles.profileContainer}>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${profileName}'s avatar`}
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.profilePlaceholder}>
                      {profileName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={styles.profileName}>{profileName}</span>
                </div>
              </div>
            )}
            <ul>
              {/* Render navigation items */}
              {mainNav.map(
                (item) =>
                  (!item.authRequired || isAuthenticated) && (
                    <li key={item.name}>{renderNavItem(item)}</li>
                  )
              )}
              {/* Logout button in sidebar */}
              {isAuthenticated && (
                <li className={styles.sidebarLogout}>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleSidebar();
                    }}
                    className={styles.sidebarLogoutButton}
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
          <nav className={styles.bottomNav}>
            <div className={styles.navItems}>
              {/* Render navigation items for bottom nav */}
              {mainNav.map(
                (item) =>
                  (!item.authRequired || isAuthenticated) && (
                    <Link
                      key={item.name}
                      to={item.link}
                      className={styles.navItem}
                    >
                      <item.icon size={24} />
                      <span>{item.name}</span>
                    </Link>
                  )
              )}
            </div>
          </nav>
        </>
      )}
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={modalView}
      />
    </div>
  );
};

export default Navbar;
