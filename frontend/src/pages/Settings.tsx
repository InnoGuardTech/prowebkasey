import { useState, useEffect } from 'react';
import axios from 'axios';
import { exportFullBackupToExcel } from '../utils/exportUtils';

function Settings() {
  const [systemName, setSystemName] = useState('نظام قيادة');
  const [logo, setLogo] = useState('');
  const [bottomNavConfig, setBottomNavConfig] = useState({
    admin: [{ path: '/', label: 'الرئيسية' }, { path: '/trips', label: 'الرحلات' }, { path: '/expenses', label: 'المصروفات' }, { path: '/reports', label: 'التقارير' }],
    accountant: [{ path: '/', label: 'الرئيسية' }, { path: '/expenses', label: 'المصروفات' }, { path: '/reports', label: 'التقارير' }],
    driver: [{ path: '/trips', label: 'الرحلات' }, { path: '/expenses', label: 'المصروفات' }]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/v1/settings?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.systemName) setSystemName(res.data.systemName);
      if (res.data.logo) setLogo(res.data.logo);
      if (res.data.bottomNavConfig) {
        try {
          setBottomNavConfig(JSON.parse(res.data.bottomNavConfig));
        } catch(e) {}
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/v1/settings', { key: 'systemName', value: systemName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.post('/api/v1/settings', { key: 'logo', value: logo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.post('/api/v1/settings', { key: 'bottomNavConfig', value: JSON.stringify(bottomNavConfig) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('تم حفظ الإعدادات بنجاح!');
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (e) {
      setMessage('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadDBBackup = () => {
    const token = localStorage.getItem('token');
    window.open(`/api/v1/settings/backup?token=${token}`, '_blank');
  };

  const handleDownloadExcelBackup = async () => {
    setIsExportingExcel(true);
    try {
      await exportFullBackupToExcel();
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">إعدادات النظام</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity Panel */}
        <div className="glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">🎨 الهوية البصرية</h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                اسم النظام
              </label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-xl focus:ring-2 focus:ring-cyber-indigo outline-none transition-all dark:text-white"
                placeholder="أدخل اسم النظام..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                شعار الشركة (رابط URL أو Base64)
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-xl focus:ring-2 focus:ring-cyber-indigo outline-none transition-all dark:text-white"
                placeholder="https://example.com/logo.png"
              />
              {logo && (
                <div className="mt-3 p-3 bg-zinc-100 dark:bg-titanium-950 rounded-xl flex items-center gap-3">
                  <img src={logo} alt="Preview" className="w-12 h-12 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="text-xs text-zinc-500">معاينة الشعار</span>
                </div>
              )}
              <p className="text-xs text-zinc-500 mt-2">اتركه فارغاً لاستخدام الحرف الافتراضي (ق).</p>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-bold ${message.includes('بنجاح') ? 'bg-finance-green/10 text-finance-green' : 'bg-finance-red/10 text-finance-red'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-cyber-indigo hover:bg-cyber-indigo/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyber-indigo/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
            </button>
          </form>
        </div>

        {/* Backup Panel */}
        <div className="glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">🛡️ النسخ الاحتياطي</h2>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <h3 className="text-amber-600 dark:text-amber-400 font-bold mb-2 flex items-center gap-2">
              <span>⚠️</span> تنبيه هام جداً
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-500/80 leading-relaxed">
              تأكد من تحميل نسخة احتياطية بشكل دوري (أسبوعياً أو شهرياً) لتجنب فقدان أي بيانات مالية في حال حدوث عطل في الجهاز.
            </p>
          </div>

          <div className="space-y-3">
            {/* Excel Backup */}
            <div className="border border-zinc-200 dark:border-titanium-800 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">نسخة احتياطية Excel</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">تصدير كافة البيانات (القواطر، السواقين، الإيرادات، المصروفات، الرحلات) إلى ملف Excel متعدد الأوراق.</p>
                </div>
              </div>
              <button
                onClick={handleDownloadExcelBackup}
                disabled={isExportingExcel}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isExportingExcel ? '⏳ جاري التصدير...' : '📊 تحميل نسخة Excel الشاملة'}
              </button>
            </div>

            {/* Raw DB Backup */}
            <div className="border border-zinc-200 dark:border-titanium-800 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🗄️</span>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">النسخة الخام (JSON)</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">تنزيل نسخة تقنية كاملة من قاعدة البيانات بصيغة (.json). يُنصح بها للمبرمجين ولترحيل البيانات بين الخوادم.</p>
                </div>
              </div>
              <button
                onClick={handleDownloadDBBackup}
                className="w-full bg-zinc-800 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
              >
                🗄️ تحميل قاعدة البيانات (.json)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Panel - Visual UI */}
      <div className="glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">تخصيص شريط التنقل السفلي</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">حدد الصفحات التي تظهر في الشريط السفلي لكل نوع مستخدم على الجوال</p>
        </div>

        {/* All available pages */}
        {(() => {
          const allPages = [
            { path: '/', label: 'لوحة التحكم' },
            { path: '/trucks', label: 'القواطر' },
            { path: '/drivers', label: 'السواقين' },
            { path: '/contractors', label: 'المقاولين' },
            { path: '/trips', label: 'الرحلات' },
            { path: '/categories', label: 'فئات المصروفات' },
            { path: '/invoices', label: 'الإيرادات' },
            { path: '/expenses', label: 'المصروفات' },
            { path: '/reports', label: 'التقارير' },
            { path: '/settings', label: 'الإعدادات' },
          ];
          const roleLabels: Record<string, string> = { admin: 'المدير', accountant: 'المحاسب', driver: 'السائق' };
          const roleColors: Record<string, string> = {
            admin: 'border-cyber-indigo/30 bg-cyber-indigo/5',
            accountant: 'border-emerald-500/30 bg-emerald-500/5',
            driver: 'border-amber-500/30 bg-amber-500/5',
          };
          const roleBadge: Record<string, string> = {
            admin: 'bg-cyber-indigo/10 text-cyber-indigo',
            accountant: 'bg-emerald-500/10 text-emerald-600',
            driver: 'bg-amber-500/10 text-amber-600',
          };

          const isChecked = (r: string, path: string) => {
            const items = bottomNavConfig[r as keyof typeof bottomNavConfig] || [];
            return items.some((i: any) => i.path === path);
          };

          const toggleItem = (r: string, page: { path: string; label: string }) => {
            const current: any[] = bottomNavConfig[r as keyof typeof bottomNavConfig] || [];
            const exists = current.some((i: any) => i.path === page.path);
            const updated = exists
              ? current.filter((i: any) => i.path !== page.path)
              : [...current, { path: page.path, label: page.label }];
            setBottomNavConfig({ ...bottomNavConfig, [r]: updated });
          };

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {['admin', 'accountant', 'driver'].map((r) => (
                <div key={r} className={`border-2 ${roleColors[r]} rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-5`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${roleBadge[r]}`}>
                      {roleLabels[r]}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({(bottomNavConfig[r as keyof typeof bottomNavConfig] || []).length} محدد)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {allPages.map((page) => {
                      const checked = isChecked(r, page.path);
                      return (
                        <button
                          key={page.path}
                          type="button"
                          onClick={() => toggleItem(r, page)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium text-right ${
                            checked
                              ? 'bg-cyber-indigo text-white border-cyber-indigo shadow-sm'
                              : 'bg-white dark:bg-titanium-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-titanium-800 hover:border-cyber-indigo/50 hover:text-cyber-indigo'
                          }`}
                        >
                          <span>{page.label}</span>
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            checked ? 'bg-white border-white' : 'border-zinc-300 dark:border-titanium-600'
                          }`}>
                            {checked && <span className="w-2.5 h-2.5 rounded-full bg-cyber-indigo block" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 w-full bg-cyber-indigo hover:bg-cyber-indigo/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyber-indigo/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* System Info */}
      <div className="glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">ℹ️ معلومات النظام</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-50 dark:bg-titanium-950 rounded-xl p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">اسم النظام</p>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">{systemName}</p>
          </div>
          <div className="bg-zinc-50 dark:bg-titanium-950 rounded-xl p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">الإصدار</p>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">v1.0.0</p>
          </div>
          <div className="bg-zinc-50 dark:bg-titanium-950 rounded-xl p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">قاعدة البيانات</p>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">SQLite</p>
          </div>
          <div className="bg-zinc-50 dark:bg-titanium-950 rounded-xl p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">تاريخ اليوم</p>
            <p className="font-bold text-zinc-900 dark:text-white text-sm">{new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
