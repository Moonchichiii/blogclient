import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Send, ArrowUp } from 'lucide-react';
import { SiFacebook, SiTwitter, SiInstagram, SiLinkedin } from 'react-icons/si';
import styles from './Footer.module.css';

const Footer = () => {
    const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted email:', email, 'Subject:', subject);
        setEmail('');
        setSubject('');
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3>About Us</h3>
                    <p>The Blog is a modern platform where users share their ideas and stories. Join our community to connect with like-minded individuals.</p>
                </div>

                <div className={styles.footerSection}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <h3>Get in Touch</h3>
                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className={styles.subjectInput}
                        />
                        <div className={styles.inputContainer}>
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" aria-label="Send">
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} The Blog. All rights reserved.</p>
                <ul>
    <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><SiFacebook size={20} /></a></li>
    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><SiTwitter size={20} /></a></li>
    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><SiInstagram size={20} /></a></li>
    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><SiLinkedin size={20} /></a></li>
</ul>

            </div>

            <div className={styles.scrollToTopContainer}>
                <a href="#top" className={styles.scrollToTop} aria-label="Scroll to top">
                    <ArrowUp size={20} className={styles.arrowIcon} />
                </a>
            </div>
        </footer>
    );
};

export default Footer;