import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-titanium-900 rounded-2xl border border-zinc-200 dark:border-titanium-800 p-8 text-center animate-fade-in shadow-sm m-4">
          <div className="w-20 h-20 bg-finance-red/10 rounded-full flex items-center justify-center mb-6">
            <FiAlertTriangle className="text-4xl text-finance-red" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">عذراً، حدث خطأ غير متوقع</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">
            لقد حدثت مشكلة أثناء محاولة تحميل هذه الصفحة. إذا كنت تحاول تحديث الصفحة بسرعة، يرجى الانتظار قليلاً.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-cyber-indigo/30 transition-all hover:-translate-y-1"
          >
            تحديث الصفحة وإعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
