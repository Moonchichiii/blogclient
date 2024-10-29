import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/LayOut';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './features/Accounts/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';
import './App.css';

// Lazy imports - removed VerificationHandler
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const TwoFactorSetupPage = lazy(() => import('./features/Accounts/TwoFactorSetup'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const About = lazy(() => import('./pages/About/About'));
const MyPosts = lazy(() => import('./pages/Blog/MyPosts'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

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
          <Route path="/" element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          } />

          {/* Layout Wrapper for Main Content */}
          <Route element={<Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
            {/* Mixed Access Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile-settings" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/setup-2fa" element={
              <ProtectedRoute>
                <TwoFactorSetupPage />
              </ProtectedRoute>
            } />
            <Route path="/my-posts" element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;