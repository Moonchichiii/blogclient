import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/Accounts/hooks/useAuth';
import App from './App.jsx';
import Modal from 'react-modal';
import queryClient from './api/queryClient';
import './index.css';
Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
