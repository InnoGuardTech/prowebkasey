import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import GlobalSearch from './GlobalSearch';

function Layout({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [systemName, setSystemName] = useState('نظام القواطر');
  const [systemLogo, setSystemLogo] = useState('');
  const [bottomNavConfig, setBottomNavConfig] = useState<any>(null);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`/api/v1/settings?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.systemName) setSystemName(res.data.systemName);
      if (res.data.logo) setSystemLogo(res.data.logo);
      if (res.data.bottomNavConfig) {
        try {
          setBottomNavConfig(JSON.parse(res.data.bottomNavConfig));
        } catch (e) {
          console.error('Invalid bottomNavConfig JSON');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const menuItems = [
    { path: '/', label: 'لوحة التحكم' },
    { path: '/trucks', label: 'القواطر' },
    { path: '/drivers', label: 'السواقين' },
    { path: '/contractors', label: 'المقاولين' },
    { path: '/trips', label: 'الرحلات' },
    { path: '/categories', label: 'فئات المصروفات' },
    { path: '/invoices', label: 'الإيرادات والفواتير' },
    { path: '/expenses', label: 'المصروفات' },
    { path: '/reports', label: 'التقارير' },
    { path: '/users', label: 'المستخدمين' },
    { path: '/audit', label: 'سجل التدقيق' },
    { path: '/settings', label: 'الإعدادات' },
  ];

  const defaultBottomNavItems: Record<string, { path: string; label: string }[]> = {
    admin: [
      { path: '/', label: 'الرئيسية' },
      { path: '/trips', label: 'الرحلات' },
      { path: '/expenses', label: 'المصروفات' },
      { path: '/reports', label: 'التقارير' },
    ],
    manager: [
      { path: '/', label: 'الرئيسية' },
      { path: '/trips', label: 'الرحلات' },
      { path: '/expenses', label: 'المصروفات' },
      { path: '/reports', label: 'التقارير' },
    ],
    accountant: [
      { path: '/', label: 'الرئيسية' },
      { path: '/expenses', label: 'المصروفات' },
      { path: '/reports', label: 'التقارير' },
    ],
    driver: [
      { path: '/trips', label: 'الرحلات' },
      { path: '/expenses', label: 'المصروفات' },
    ],
  };

  const getRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'admin';
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map((c) =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      return JSON.parse(jsonPayload).role;
    } catch (e) {
      return 'admin';
    }
  };

  const role = getRole();
  const isAdmin = role === 'admin' || role === 'manager';

  const filteredMenu = menuItems.filter((item) => {
    if (isAdmin) return true;
    if (role === 'accountant') {
      return ['/', '/categories', '/invoices', '/expenses', '/reports', '/users'].includes(item.path);
    }
    if (role === 'driver') {
      return ['/trips', '/expenses'].includes(item.path);
    }
    return false;
  });

  const getActiveBottomNavItems = () => {
    const effectiveRole = (role === 'manager' || role === 'owner' || role === 'admin') ? 'admin' : role;
    if (bottomNavConfig && bottomNavConfig[effectiveRole]) {
      return bottomNavConfig[effectiveRole];
    }
    return defaultBottomNavItems[effectiveRole] || defaultBottomNavItems.admin;
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-titanium-950 overflow-hidden relative transition-colors duration-300">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-[70] w-72 bg-white dark:bg-titanium-900 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 flex items-center justify-between border-b border-zinc-200 dark:border-titanium-800/50">
          <div className="flex items-center gap-3">
            {systemLogo ? (
              <img src={systemLogo} alt="Logo" className="w-10 h-10 rounded-xl shadow-lg object-contain bg-white" />
            ) : (
              <div className="w-10 h-10 bg-cyber-indigo text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">ق</div>
            )}
            <h2 className="text-lg font-bold text-cyber-cyan truncate">{systemName}</h2>
          </div>
          <button
            className="lg:hidden text-zinc-500 p-2 bg-zinc-50 dark:bg-titanium-950 rounded-lg hover:bg-zinc-100 dark:hover:bg-titanium-800 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? 'bg-cyber-indigo text-white shadow-md shadow-cyber-indigo/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-titanium-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 pb-8 lg:pb-4 border-t border-zinc-200 dark:border-titanium-800/50 bg-gradient-to-b from-transparent to-zinc-50/80 dark:to-titanium-950/80 mt-auto shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-finance-red/10 hover:bg-finance-red text-finance-red hover:text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm shadow-sm"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50 dark:bg-titanium-950 pb-20 lg:pb-0">
        <header className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl shadow-sm border-b border-zinc-200 dark:border-titanium-800 px-3 sm:px-4 flex justify-between items-center z-20 shrink-0 h-16 sticky top-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="lg:hidden text-zinc-500 p-2 bg-zinc-50 dark:bg-titanium-950 rounded-lg hover:bg-zinc-100 dark:hover:bg-titanium-800 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white truncate hidden md:block">
              {filteredMenu.find((item) => item.path === location.pathname)?.label || 'إدارة النظام'}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            <div className="flex-1 max-w-[200px] sm:max-w-[300px]">
              <GlobalSearch />
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors text-sm shrink-0"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? '☀' : '◑'}
            </button>
            <span className="hidden md:inline text-zinc-500 dark:text-zinc-400 text-sm">
              {isAdmin ? 'المدير' : role === 'accountant' ? 'المحاسب' : 'السائق'}
            </span>
            <div className="w-9 h-9 bg-cyber-indigo rounded-full flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
              {isAdmin ? 'م' : role === 'accountant' ? 'ح' : 'س'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Elegant Footer Credits */}
          <div className="mt-12 mb-4 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-all duration-500">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-medium mb-2">تصميم وتطوير</p>
            <div className="flex items-center gap-3">
               <span className="w-12 h-[1px] bg-gradient-to-l from-cyber-indigo/50 to-transparent"></span>
               <p className="text-[15px] font-black bg-gradient-to-r from-cyber-indigo to-cyber-cyan bg-clip-text text-transparent drop-shadow-sm">م. عبدالعزيز وهاس</p>
               <span className="w-12 h-[1px] bg-gradient-to-r from-cyber-indigo/50 to-transparent"></span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-3 bg-zinc-100/50 dark:bg-titanium-900/50 px-5 py-2 rounded-2xl sm:rounded-full border border-zinc-200/50 dark:border-titanium-800/50">
              <span className="flex items-center gap-2" dir="ltr">
                <span className="text-cyber-cyan text-xs">📱</span> +967 781 291 954
              </span>
              <span className="hidden sm:block text-zinc-300 dark:text-titanium-700 opacity-50">|</span>
              <span className="flex items-center gap-2" dir="ltr">
                <span className="text-cyber-cyan text-xs">📱</span> +967 715 358 127
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - clean, no icons, larger text */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border-t border-zinc-200/50 dark:border-titanium-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 safe-area-bottom">
        <div className="flex items-stretch h-16">
          {getActiveBottomNavItems().map((item: any) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 ${
                  isActive
                    ? ''
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50/50 dark:hover:bg-titanium-800/30'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-[20%] right-[20%] h-1 bg-gradient-to-r from-cyber-indigo to-cyber-cyan rounded-b-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] shadow-cyber-cyan/40" />
                )}
                <span className={`text-base font-semibold tracking-wide transition-all duration-300 ${
                  isActive 
                    ? 'font-black bg-gradient-to-r from-cyber-indigo to-cyber-cyan bg-clip-text text-transparent drop-shadow-sm scale-110' 
                    : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex-1 flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50/50 dark:hover:bg-titanium-800/30 transition-all duration-300"
          >
            <span className="text-base font-semibold">المزيد</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Layout;
