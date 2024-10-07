import React from 'react';
import { withRouter } from 'react-router-dom';

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
    this.props.history.push('/');
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

export default withRouter(ErrorBoundary);
