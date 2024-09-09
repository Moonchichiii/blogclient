import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <h3>About Us</h3>
                    <p> is a modern blogging platform that allows users to share their thoughts, ideas, and stories with the world. Our mission is to create a space where everyone can have a voice and connect with like-minded individuals.</p>
                </div>
                <div className={styles.footerSection}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </div>
                <div className={styles.footerSection}>
                    <h3>Contact</h3>
                    <p>Email: tblog2024@gmail.com</p>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; 2024 The Blog. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
