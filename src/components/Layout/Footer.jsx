import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Facebook, Twitter, Instagram, Linkedin, Send, ArrowUp } from 'lucide-react';
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
                            <button type="submit" aria-label="Send"><Send size={16} /></button>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>&copy; 2024 The Blog. All rights reserved.</p>
                <ul className={styles.socials}>
                    <li><a href="#"><Facebook size={20} /></a></li>
                    <li><a href="#"><Twitter size={20} /></a></li>
                    <li><a href="#"><Instagram size={20} /></a></li>
                    <li><a href="#"><Linkedin size={20} /></a></li>
                </ul>
            </div>

            <div className={styles.scrollToTopContainer}>
                <a href="#top" className={styles.scrollToTopLink}>
                    <button className={styles.scrollToTop} aria-label="Scroll to top">
                        <ArrowUp className={styles.arrowIcon} />
                    </button>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
