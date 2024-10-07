import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    this.props.navigate('/'); // Use navigate function passed via props
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong. Please refresh the page or try again later.</h1>
          <button onClick={this.handleReload}>Reload Page</button>
          <button onClick={this.handleGoBack}>Go to Home</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a functional wrapper to use `useNavigate` and pass `navigate` as a prop
const ErrorBoundaryWithRouter = (props) => {
  const navigate = useNavigate();
  return <ErrorBoundary {...props} navigate={navigate} />;
};

export default ErrorBoundaryWithRouter;
