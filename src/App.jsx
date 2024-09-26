import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from './components/Auth/Modal';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import useAuth from './hooks/useAuth';
import Toast from './components/Toast/Toast';
import useToast from './hooks/useToast';
import './App.css';
import { Loader } from 'lucide-react';

// Lazy imports
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const EmailConfirmation = lazy(() => import('./components/Auth/EmailConfirmation'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const TwoFactorSetupPage = lazy(() => import('./components/Auth/TwoFactorSetupPage'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const About = lazy(() => import('./pages/About/About'));
const MyPosts = lazy(() => import('./pages/Blog/MyPosts'));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('signin');
  const { toast, showToast } = useToast();

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <ErrorBoundary>
      <Layout onOpenModal={handleOpenModal}>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialView={modalType} showToast={showToast} />
        <Toast {...toast} />
        <Suspense fallback={<Loader className="animate-spin" />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home showToast={showToast} />} />
            <Route path="/about" element={<About showToast={showToast} />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard showToast={showToast} /></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/activate/:uidb64/:token" element={<EmailConfirmation showToast={showToast} />} />
            <Route path="/setup-2fa" element={<ProtectedRoute><TwoFactorSetupPage showToast={showToast} /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog showToast={showToast} />} />
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
    return <Loader className="animate-spin" />;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;