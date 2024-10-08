import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './features/Accounts/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';


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

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-page"><Loader className="animate-spin" size={48} /></div>;
  }

  return (
    <ErrorBoundary>
      <Layout>
        <ToastContainer />
        <Suspense fallback={<div className="loading-spinner"><Loader className="animate-spin" size={32} /></div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/activate/:uidb64/:token" element={<EmailConfirmation />} />
            <Route path="/setup-2fa" element={<ProtectedRoute><TwoFactorSetupPage /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-page"><Loader className="animate-spin" size={48} /></div>;
  }

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>    
  );
};

export default App;
