import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowUp, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import styles from './Footer.module.css';
import { useAuth } from '../../features/Accounts/hooks/useAuth';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const form = useRef(); // UseRef for the form

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(''); // Add message state

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
      .then(
        () => {
          console.log('SUCCESS!');
          setEmail('');
          setSubject('');
          setMessage(''); // Clear fields after successful send
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerSection}>
            <h3>About Us</h3>
            <p>The Blog is a modern platform where users share their ideas and stories. Join our community to connect with like-minded individuals.</p>
          </div>
          <div className={`${styles.footerSection} ${styles.desktopOnly}`}>
            <h3>Quick Links</h3>
            <ul className={styles.quickLinks}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
            </ul>
          </div>
        </div>
        <div className={styles.footerContact}>
          <div className={styles.footerSection}>
            <h3>Get in Touch</h3>
            <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
              <input
                type="text"
                name="user_name"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className={styles.subjectInput}
              />
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Send">
                  <Send size={15} />
                </button>
              </div>
              <textarea
                name="message"
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className={styles.messageInput}
              />
            </form>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.legalLinks}>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} The Blog. All rights reserved.</p>
        <ul className={styles.socialLinks}>
          <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={20} /></a></li>
          <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a></li>
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
