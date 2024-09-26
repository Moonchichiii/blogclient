import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { Sun, Moon } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = ({ onOpenModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('lightMode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('lightMode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        
        <div className={styles.navbarContainer}>
            <div id="top"></div>
            
            <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
                <div className={styles.logo}>
                    <Link to="/">TheBlog<span>Client</span></Link>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/home">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/blog">Blog</Link>
                    {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
                </div>
                <div className={styles.buttons}>
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => onOpenModal('signin')} className={styles.authButton}>Sign In</button>
                            <button onClick={() => onOpenModal('signup')} className={styles.authButton}>Sign Up</button>
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
                    <Link to="/blog" onClick={closeMenu}>Blog</Link>
                    {isAuthenticated && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
                </div>
                <div className={styles.mobileButtons}>
                    {!isAuthenticated ? (
                        <>
                            <button onClick={() => { onOpenModal('signin'); closeMenu(); }} className={styles.authButton}>Sign In</button>
                            <button onClick={() => { onOpenModal('signup'); closeMenu(); }} className={styles.authButton}>Sign Up</button>
                            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                        </>
                    ) : (
                        <button onClick={handleLogout} className={`${styles.authButton} ${styles.logoutButton}`}>Logout</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;