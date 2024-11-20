import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import { Loader } from 'lucide-react';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, activateAccount, isActivating } = useAuth();
  const [isProcessingToken, setIsProcessingToken] = useState(false);


  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setIsProcessingToken(true);
      activateAccount(token)
        .then(() => {
          navigate('/dashboard', {
            state: { isNewRegistration: true },
          });
          window.history.replaceState({}, '', '/dashboard');
        })
        .catch(() => {
          navigate('/home');
        })
        .finally(() => {
          setIsProcessingToken(false);
        });
    }
  }, [searchParams, activateAccount, navigate]);

  // Redirect only if authenticated and not processing anything
  useEffect(() => {
    if (isAuthenticated && !isActivating && !isProcessingToken) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isActivating, isProcessingToken, navigate]);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Update CSS variables for gradient following mouse
      document.documentElement.style.setProperty('--mouse-x', `${(clientX / innerWidth) * 50}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(clientY / innerHeight) * 50}%`);

      // Optional: Add subtle rotation effect to content
      if (window.matchMedia('(hover: hover)').matches) {
        const content = document.querySelector(`.${styles.content}`);
        if (content) {
          const rect = content.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * 5;
          const rotateY = ((x - centerX) / centerX) * 5;

          content.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
          `;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate('/home');
  };

  // **Move the conditional return after all hooks**
  if (isProcessingToken) {
    return (
      <div className={styles.processingContainer}>
        <Loader className="animate-spin" size={32} />
        <p>Verifying your email...</p>
      </div>
    );
  }

  return (
    <main className={styles.landing}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.titleWord}>Welcome</span>
          <span className={styles.titleWord}>to</span>
          <span className={styles.titleWord}>The Blog</span>
        </h1>
        <p className={styles.subtitle}>Where Stories Come Alive</p>
        <button
          onClick={handleGetStarted}
          className={styles.exploreButton}
          disabled={isActivating || isProcessingToken}
        >
          Begin Your Journey
        </button>
      </div>
    </main>
  );
};

export default Landing;
