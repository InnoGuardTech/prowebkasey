import { useState } from 'react';
import { useTenant } from './contexts/TenantContext';
import './index.css';

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const { tenantName, tenantLogo } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }
      
      onLogin(data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-titanium-950 px-4 relative transition-colors duration-300">
      <div className="bg-white dark:bg-titanium-900 p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-zinc-200 dark:border-titanium-800">
        <div className="text-center mb-8 flex flex-col items-center">
          {tenantLogo && (
            <img src={tenantLogo} alt={tenantName} className="w-20 h-20 mb-4 rounded-2xl shadow-md object-contain" />
          )}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{tenantName}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">سجل الدخول للمتابعة</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-titanium-800 bg-white dark:bg-titanium-950 rounded-xl focus:ring-2 focus:ring-tenant-primary focus:border-tenant-primary outline-none transition-all text-left dir-ltr text-zinc-900 dark:text-white"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-titanium-800 bg-white dark:bg-titanium-950 rounded-xl focus:ring-2 focus:ring-tenant-primary focus:border-tenant-primary outline-none transition-all text-left dir-ltr text-zinc-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tenant-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-tenant-primary/30 transition-all flex justify-center items-center active:scale-95"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'تسجيل الدخول'}
          </button>
        </form>
      </div>

      {/* Project Credits */}
      <div className="absolute bottom-6 text-center text-xs text-gray-500 w-full left-0 z-0 px-4">
        <p className="mb-2">تصميم وتطوير: <span className="font-bold text-gray-700">م. عبدالعزيز وهاس</span></p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-gray-400 font-mono text-[11px]">
          <span dir="ltr">📱 +967 781 291 954</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span dir="ltr">📱 +967 715 358 127</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
