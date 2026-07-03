import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { exportToExcel, exportToPDF, printTable } from '../utils/exportUtils';

interface Driver {
  id: string;
  user: { full_name: string; phone: string; email: string };
  license_number: string;
  license_expiry: string;
  is_active: boolean;
}

function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', full_name: '', phone: '', email: '', password: '', license_number: '', license_expiry: '', is_active: true });
  const [error, setError] = useState('');

  const fetchDrivers = () => {
    const token = localStorage.getItem('token');
    fetch(`/api/v1/drivers?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setDrivers(data.data);
          setTotalPages(data.lastPage || 1);
        } else {
          setDrivers(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, [page]);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/drivers/${form.id}` : '/api/v1/drivers';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل السائق' : 'فشل في إضافة السائق');
      
      closeModal();
      fetchDrivers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', full_name: '', phone: '', email: '', password: '', license_number: '', license_expiry: '', is_active: true });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (driver: Driver) => {
    const dateFormatted = driver.license_expiry ? new Date(driver.license_expiry).toISOString().split('T')[0] : '';
    setForm({ 
      id: driver.id, 
      full_name: driver.user?.full_name || '', 
      phone: driver.user?.phone || '', 
      email: driver.user?.email || '',
      password: '', // Leave blank when editing unless changing
      license_number: driver.license_number || '', 
      license_expiry: dateFormatted,
      is_active: driver.is_active
    });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من إيقاف هذا السائق؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/drivers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: false })
      });
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = drivers.map(d => ({
      'الاسم': d.user?.full_name || '-',
      'رقم الجوال': d.user?.phone || '-',
      'رقم الرخصة': d.license_number || '-',
      'تاريخ الانتهاء': d.license_expiry ? new Date(d.license_expiry).toLocaleDateString('ar-SA') : '-',
      'الحالة': d.is_active ? 'نشط' : 'غير نشط'
    }));
    exportToExcel(dataToExport, 'السواقين', 'السائقين');
  };

  const handleExportPDF = async () => {
    const columns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Phone', dataKey: 'phone' },
      { header: 'License', dataKey: 'license' },
      { header: 'Expiry Date', dataKey: 'expiry' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = drivers.map(d => ({
      name: d.user?.full_name || '-',
      phone: d.user?.phone || '-',
      license: d.license_number || '-',
      expiry: d.license_expiry ? new Date(d.license_expiry).toLocaleDateString('en-SA') : '-',
      status: d.is_active ? 'Active' : 'Inactive',
    }));
    await exportToPDF(columns, rows, 'Drivers', 'Drivers Report - Prokasey', [
      { label: 'Total Drivers', value: String(drivers.length) },
      { label: 'Active Drivers', value: String(drivers.filter(d => d.is_active).length) },
    ]);
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة السواقين</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{drivers.filter(d => d.is_active).length} سائق نشط من أصل {drivers.length}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => printTable('السائقين - Prokasey')} className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">طباعة</button>
          <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">Excel</button>
          <button onClick={handleExportPDF} className="bg-finance-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">PDF</button>
          <button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            + إضافة سائق
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full min-w-max">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">الاسم</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">رقم الجوال</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">رقم الرخصة</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">تاريخ الانتهاء</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">الحالة</th>
                <th className="p-3 md:p-5 font-medium text-center sm:whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-zinc-500 dark:text-zinc-400">جاري التحميل...</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-zinc-500 dark:text-zinc-400">لا يوجد سواقين</td></tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950 transition-colors">
                    <td data-label="الاسم" className="p-3 md:p-5 font-medium text-zinc-900 dark:text-white sm:whitespace-nowrap">{driver.user?.full_name}</td>
                    <td data-label="رقم الجوال" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 font-mono text-sm sm:whitespace-nowrap" dir="ltr">{driver.user?.phone || '-'}</td>
                    <td data-label="رقم الرخصة" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 font-mono text-sm sm:whitespace-nowrap">{driver.license_number}</td>
                    <td data-label="تاريخ الانتهاء" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString('ar-SA') : '-'}</td>
                    <td data-label="الحالة" className="p-3 md:p-5 sm:whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        driver.is_active ? 'bg-finance-green/10 text-finance-green' : 'bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {driver.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td data-label="الإجراءات" className="p-3 md:p-5 text-center sm:whitespace-nowrap">
                      <button onClick={() => openEditModal(driver)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل</button>
                      <button onClick={() => handleDelete(driver.id)} className="text-finance-red hover:text-red-700 text-sm">إيقاف</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-popup overflow-y-auto max-h-[85vh] flex flex-col relative border border-zinc-100 dark:border-titanium-800">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">رقم الجوال</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none text-left dir-ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none text-left dir-ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">
                  {isEditing ? 'كلمة المرور (اتركها فارغة إذا لم ترد تغييرها)' : 'كلمة المرور'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none text-left dir-ltr"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">رقم الرخصة</label>
                  <input
                    type="text"
                    value={form.license_number}
                    onChange={e => setForm({ ...form, license_number: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">تاريخ انتهاء الرخصة</label>
                  <input
                    type="date"
                    value={form.license_expiry}
                    onChange={e => setForm({ ...form, license_expiry: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="is_active_driver"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-cyber-cyan bg-zinc-50 dark:bg-titanium-950 border-zinc-200 dark:border-titanium-800 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_active_driver" className="ml-2 rtl:mr-2 text-sm font-bold text-gray-900">
                    حساب نشط (يمكنه الدخول للنظام)
                  </label>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-cyber-indigo hover:bg-cyber-indigo/90 text-white py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                حفظ
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-zinc-50 dark:bg-titanium-950 hover:bg-zinc-200 dark:hover:bg-titanium-800 text-zinc-900 dark:text-white py-2 rounded-lg font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drivers;
