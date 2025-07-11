import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, Card } from '../ui';

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 [Chat Error Boundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Chat Error
          </h3>
          <p className="text-slate-400 mb-4">
            Something went wrong with the chat interface. Please try again.
          </p>
          <Button onClick={this.handleRetry} variant="primary">
            Retry
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;
