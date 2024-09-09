import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from './components/Auth/Modal';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import Toast from './components/Toast';
import useToast from './hooks/useToast';
import styles from './App.module.css';

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmailConfirmation = lazy(() => import('./components/Auth/EmailConfirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('signin');
  const { toast, showToast } = useToast();

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className={styles.app}>
          <Layout onOpenModal={handleOpenModal}>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialView={modalType} showToast={showToast} />
            <Toast {...toast} />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home showToast={showToast} />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard showToast={showToast} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/activate/:uidb64/:token"
                  element={
                    <EmailConfirmation
                      onSuccess={() => {
                        showToast('Email confirmed successfully!', 'success');
                        handleOpenModal('signin');
                      }}
                      showToast={showToast}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;