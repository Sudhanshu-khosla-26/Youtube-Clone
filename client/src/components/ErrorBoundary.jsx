import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // You can log the error to an error reporting service here
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary dark-theme flex items-center justify-center min-h-screen bg-[#ofofof] p-20">
                    <div className="error-content bg-[#272727] p-8 rounded-lg shadow-lg max-w-md w-90 mx-auto">
                        <div className="flex items-center justify-center">
                            <div className="error-icon text-4xl mb-4">⚠️</div>
                        </div>
                        <h1 className="text-2xl font-semibold mb-4 text-center">Oops! Something went wrong</h1>
                        <p className="error-message text-[#B1B1B1] leading-relaxed mb-8 text-center">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <div className="flex items-center justify-center">
                            <button
                                className="retry-button bg-[#2ECC71] hover:bg-[#34C759] text-white font-semibold py-2 px-4 rounded"
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    window.location.reload();
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                        <p className="support-text text-[#B1B1B1] mt-4 text-sm text-center">
                            If the problem persists, please contact support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
