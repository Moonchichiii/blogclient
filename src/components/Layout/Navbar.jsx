import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/Accounts/authSlice';
import { Sun, Moon } from 'lucide-react';
import styles from './Navbar.module.css';
import AuthModal from '../../features/Accounts/AuthModal';
import { queryClient } from '../../utils/queryClient';
import { fetchPosts } from '../../features/Posts/postSlice'; // Adjust this import based on your slice location

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState('signin');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Prefetch posts when hovering over the "Blog" link
    const prefetchPosts = () => {
        queryClient.prefetchQuery('posts', fetchPosts);
    };

    const handleOpenModal = (view) => {
        setModalView(view);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        dispatch(logoutUser());
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('darkMode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('darkMode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <div className={styles.navbarContainer}>
            <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
                <div className={styles.logo}>
                    <Link to="/">TheBlog<span>Client</span></Link>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/home">Home</Link>
                    <Link to="/about">About</Link>
                    <Link onMouseEnter={prefetchPosts} to="/blog">Blog</Link>
                    {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
                </div>
                <div className={styles.buttons}>
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => handleOpenModal('signin')} className={styles.authButton}>Sign In</button>
                            <button onClick={() => handleOpenModal('signup')} className={styles.authButton}>Sign Up</button>
                        </>
                    ) : (
                        <button onClick={handleLogout} className={`${styles.authButton} ${styles.logoutButton}`}>Logout</button>
                    )}
                    <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
                <label className={styles.burger} htmlFor="burger">
                    <input type="checkbox" id="burger" checked={isMenuOpen} onChange={toggleMenu} />
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
            </nav>
            <div className={`${styles.menuContainer} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <div className={styles.mobileNavLinks}>
                    <Link to="/home" onClick={closeMenu}>Home</Link>
                    <Link to="/about" onClick={closeMenu}>About</Link>
                    <Link onMouseEnter={prefetchPosts} onClick={closeMenu} to="/blog">Blog</Link>
                    {isAuthenticated && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
                </div>
                <div className={styles.mobileButtons}>
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => { handleOpenModal('signin'); closeMenu(); }} className={styles.authButton}>Sign In</button>
                            <button onClick={() => { handleOpenModal('signup'); closeMenu(); }} className={styles.authButton}>Sign Up</button>
                        </>
                    ) : (
                        <button onClick={handleLogout} className={`${styles.authButton} ${styles.logoutButton}`}>Logout</button>
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialView={modalView}
                showToast={() => {}}
            />
        </div>
    );
};

export default Navbar;
