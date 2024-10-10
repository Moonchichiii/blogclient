import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/LayOut';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './features/Accounts/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';
import './App.css';

// Lazy imports
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const EmailConfirmation = lazy(() => import('./features/Accounts/EmailConfirmation'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const TwoFactorSetupPage = lazy(() => import('./features/Accounts/TwoFactorSetupPage'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const About = lazy(() => import('./pages/About/About'));
const MyPosts = lazy(() => import('./pages/Blog/MyPosts'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkMode');
      document.body.classList.remove('lightMode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('lightMode');
      document.body.classList.remove('darkMode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prevMode) => !prevMode);

  return (
    <ErrorBoundary>
      <ToastContainer 
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover={true}      
      />
      <Suspense fallback={<div className="loading-spinner"><Loader className="animate-spin" size={32} /></div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/activate/:uidb64/:token/" element={<EmailConfirmation />} />
            <Route path="/setup-2fa" element={<ProtectedRoute><TwoFactorSetupPage /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;