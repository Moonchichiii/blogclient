import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import styles from './Navbar.module.css';

const Navbar = ({ onOpenModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className={styles.navbarContainer}>
            <nav className={styles.nav} role="navigation" aria-label="Main Navigation">
                <div className={styles.burger} onClick={toggleMenu}>
                    
                    <span className={isMenuOpen ? styles.open : ''}></span>
                    <span className={isMenuOpen ? styles.open : ''}></span>
                    <span className={isMenuOpen ? styles.open : ''}></span>
                </div>
                <div className={`${styles.menuContainer} ${isMenuOpen ? styles.menuOpen : ''}`} role="menu">
                    <div className={styles.navLinks}>
                        <Link to="/" onClick={closeMenu} role="menuitem">Home</Link>
                        {isAuthenticated && <Link to="/dashboard" onClick={closeMenu} role="menuitem">Dashboard</Link>}
                    </div>
                    <div className={styles.authButtons}>
                        {!isAuthenticated && (
                            <>
                                <button onClick={() => { onOpenModal('signin'); closeMenu(); }} className={styles.authButton} role="menuitem">Sign In</button>
                                <button onClick={() => { onOpenModal('signup'); closeMenu(); }} className={styles.authButton} role="menuitem">Sign Up</button>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" className={styles.authButton} onClick={closeMenu} role="menuitem">My Account</Link>
                                <button onClick={handleLogout} className={styles.authButton} role="menuitem">Logout</button>
                            </>
                        )}
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
