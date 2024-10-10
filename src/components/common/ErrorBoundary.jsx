import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Uncaught error:', error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong. Please refresh the page or try again later.</h1>
        <button onClick={handleReload}>Reload Page</button>
        <button onClick={handleGoBack}>Go to Home</button>
      </div>
    );
  }

  return children;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(ErrorBoundary);
