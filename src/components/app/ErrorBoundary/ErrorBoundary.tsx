import {Component, ErrorInfo, ReactNode} from 'react';
import {motion} from 'framer-motion';
import {AlertCircle} from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error, errorInfo: null};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({errorInfo});
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center  text-white p-4">
                    <motion.div
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-lg"
                    >
                        <motion.div
                            animate={{rotate: 360}}
                            transition={{duration: 2, repeat: Infinity, ease: "linear"}}
                            className="flex justify-center mb-6"
                        >
                            <AlertCircle size={48} className="text-red-500"/>
                        </motion.div>
                        <h1 className="text-2xl font-bold mb-4 text-center">Oops! Something went wrong</h1>
                        <p className="mb-4 text-gray-300">We're sorry, but an error occurred while processing your
                            request.</p>
                        <div className="bg-neutral-900 p-4 rounded-md mb-4">
                            <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
                            <p className="text-sm text-gray-300">{this.state.error && this.state.error.toString()}</p>
                            {this.state.errorInfo && (
                                <pre className="mt-2 text-xs text-gray-400 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                    </pre>
                            )}
                        </div>
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Reload Page
                        </motion.button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

