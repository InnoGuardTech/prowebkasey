import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

// Global Axios Interceptor for Error Handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      if (error.response.status >= 500) {
        toast.error('حدث خطأ في الخادم (500). يرجى المحاولة لاحقاً.');
      } else if (error.response.status === 401) {
        // Handled by local components mostly, but good to have a global catch if needed
        // toast.error('انتهت الجلسة، يرجى تسجيل الدخول مجدداً.');
      } else if (error.response.status === 429) {
        toast.error('محاولات كثيرة جداً. يرجى الانتظار قليلاً.');
      } else {
        const msg = error.response.data?.message || 'حدث خطأ في العملية.';
        toast.error(msg);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('انقطع الاتصال بالخادم. يرجى التحقق من الإنترنت.');
    } else {
      // Something happened in setting up the request
      toast.error('حدث خطأ غير معروف.');
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { fontFamily: 'Tajawal, sans-serif' } }} />
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
