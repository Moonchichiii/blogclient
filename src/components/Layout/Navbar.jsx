import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { Sun, Moon, User, FileText, MessageSquare, Tag, Star, Users } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = ({ onOpenModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
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
        document.body.classList.toggle(styles.lightMode);
    };

    return (
        <div className={styles.navbarContainer}>
            <div id="top"></div>
            <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
                <div className={styles.logo}>
                    <Link to="/">TheBlog<span>Client</span></Link>
                </div>
                <div className={styles.burger} onClick={toggleMenu}>
                    <span className={isMenuOpen ? styles.open : ''}></span>
                    <span className={isMenuOpen ? styles.open : ''}></span>
                    <span className={isMenuOpen ? styles.open : ''}></span>
                </div>
                <div className={`${styles.menuContainer} ${isMenuOpen ? styles.menuOpen : ''}`} role="menu">
                    <div className={styles.navLinks}>
                        <Link to="/home" onClick={closeMenu} role="menuitem">Home</Link>
                        <Link to="/blog" onClick={closeMenu} role="menuitem">Blog</Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" onClick={closeMenu} role="menuitem">Dashboard</Link>
                                <Link to="/my-posts" onClick={closeMenu} role="menuitem">My Posts</Link>
                                <Link to="/my-comments" onClick={closeMenu} role="menuitem">My Comments</Link>
                                <Link to="/my-ratings" onClick={closeMenu} role="menuitem">My Ratings</Link>
                                <Link to="/followers" onClick={closeMenu} role="menuitem">Followers</Link>
                            </>
                        )}
                        <Link to="/about" onClick={closeMenu} role="menuitem">About</Link>
                        <Link to="/contact" onClick={closeMenu} role="menuitem">Contact</Link>
                    </div>
                    <div className={styles.buttons}>
                        {!isAuthenticated ? (
                            <>
                                <button onClick={() => { onOpenModal('signin'); closeMenu(); }} className={styles.authButton} role="menuitem">Sign In</button>
                                <button onClick={() => { onOpenModal('signup'); closeMenu(); }} className={styles.authButton} role="menuitem">Sign Up</button>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className={styles.authButton} onClick={closeMenu} role="menuitem">My Account</Link>
                                <button onClick={handleLogout} className={`${styles.authButton} ${styles.logoutButton}`} role="menuitem">Logout</button>
                            </>
                        )}
                        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </nav>
            <header className={styles.header}>
                <h1>The Blog</h1>
            </header>
        </div>
    );
};

export default Navbar;