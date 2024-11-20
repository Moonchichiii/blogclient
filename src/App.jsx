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
const Settings = lazy(() => import('./pages/Settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const TwoFactorSetupPage = lazy(() => import('./features/Accounts/TwoFactorSetup'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const About = lazy(() => import('./pages/About/About'));
const MyPosts = lazy(() => import('./pages/MyPosts/MyPosts'));
const Followers = lazy(() => import('./pages/Followers/Followerspage'));
const AdminPosts = lazy(() => import('./pages/AdminPosts/AdminPosts'));

// Route protection components
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, userRoles } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (roles && !roles.some(role => userRoles.includes(role))) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.body.classList.toggle('darkMode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ErrorBoundary>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        limit={1}
      />
      <Suspense fallback={
        <div className="loading-spinner">
          <Loader className="animate-spin" size={32} />
        </div>
      }>
        <Routes>
          {/* Public Only Routes */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />

          {/* Layout Wrapper for Main Content */}
          <Route element={<Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
            {/* Mixed Access Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/setup-2fa" element={<ProtectedRoute><TwoFactorSetupPage /></ProtectedRoute>} />
            <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="/followers" element={<ProtectedRoute><Followers /></ProtectedRoute>} />
            <Route path="/admin/posts" element={<ProtectedRoute roles={['admin', 'staff', 'superuser']}><AdminPosts /></ProtectedRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
