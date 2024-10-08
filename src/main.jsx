import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';
import Modal from 'react-modal';
import queryClient from './api/queryClient'; // Ensure this is the correct path
import { AuthProvider } from './features/Accounts/hooks/useAuth';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
