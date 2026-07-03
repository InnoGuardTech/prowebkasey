import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { exportToExcel, exportToPDF, printTable } from '../utils/exportUtils';

interface User {
  id: string;
  full_name: string;
  role: string;
}

interface Truck {
  id: string;
  truck_number: string;
  status: string;
  notes: string;
  created_at: string;
  driver?: { id: string; full_name: string };
}

function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: '', truck_number: '', notes: '', status: 'active', driver_id: '' });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchTrucks = () => {
    const token = localStorage.getItem('token');
    fetch(`/api/v1/trucks?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setTrucks(data.data);
          setTotalPages(data.lastPage || 1);
        } else {
          setTrucks(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchDrivers = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const usersArray = data.data || data;
        if (Array.isArray(usersArray)) {
          setDrivers(usersArray.filter((u: User) => u.role === 'driver'));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrucks();
    fetchDrivers();
  }, []);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/trucks/${form.id}` : '/api/v1/trucks';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const bodyPayload: any = { 
        truck_number: form.truck_number, 
        notes: form.notes, 
        driver_id: form.driver_id || null,
        status: form.status
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyPayload)
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل القاطرة' : 'فشل في إضافة القاطرة');
      
      closeModal();
      fetchTrucks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', truck_number: '', notes: '', status: 'active', driver_id: '' });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (truck: Truck) => {
    setForm({ 
      id: truck.id, 
      truck_number: truck.truck_number, 
      notes: truck.notes || '', 
      status: truck.status || 'active',
      driver_id: truck.driver?.id || ''
    });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه القاطرة؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/trucks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrucks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-finance-green/10 text-finance-green px-3 py-1 rounded-full text-xs font-bold">نشط</span>;
      case 'maintenance':
        return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">صيانة</span>;
      default:
        return <span className="bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full text-xs font-bold">غير نشط</span>;
    }
  };

  const handleExportExcel = () => {
    const dataToExport = trucks.map(t => ({
      'رقم القاطرة': t.truck_number,
      'السائق المربوط': t.driver?.full_name || 'بدون سائق',
      'ملاحظات': t.notes || '-',
      'تاريخ الإضافة': new Date(t.created_at).toLocaleDateString('ar-SA'),
      'الحالة': t.status === 'active' ? 'نشطة' : t.status === 'maintenance' ? 'في الصيانة' : 'خارج الخدمة'
    }));
    exportToExcel(dataToExport, 'القواطر', 'القواطر');
  };

  const handleExportPDF = async () => {
    const columns = [
      { header: 'Truck Number', dataKey: 'truck_number' },
      { header: 'Driver', dataKey: 'driver' },
      { header: 'Notes', dataKey: 'notes' },
      { header: 'Date Added', dataKey: 'created_at' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = trucks.map(t => ({
      truck_number: t.truck_number,
      driver: t.driver?.full_name || 'No Driver',
      notes: t.notes || '-',
      created_at: new Date(t.created_at).toLocaleDateString('en-SA'),
      status: t.status === 'active' ? 'Active' : t.status === 'maintenance' ? 'Maintenance' : 'Out of Service',
    }));
    await exportToPDF(columns, rows, 'Trucks', 'Trucks Report - Prokasey', [
      { label: 'Total Trucks', value: String(trucks.length) },
      { label: 'Active Trucks', value: String(trucks.filter(t => t.status === 'active').length) },
    ]);
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة القواطر</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => printTable('القواطر - Prokasey')} className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">طباعة</button>
          <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">Excel</button>
          <button onClick={handleExportPDF} className="bg-finance-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">PDF</button>
          <button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            + إضافة قاطرة
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0 custom-scrollbar rounded-xl border border-zinc-200 dark:border-titanium-800">
        <div className="w-full min-w-max">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-bold sm:whitespace-nowrap">رقم القاطرة</th>
                <th className="p-3 md:p-5 font-bold sm:whitespace-nowrap">السائق المربوط</th>
                <th className="p-3 md:p-5 font-bold">ملاحظات</th>
                <th className="p-3 md:p-5 font-bold sm:whitespace-nowrap">تاريخ الإضافة</th>
                <th className="p-3 md:p-5 font-bold">الحالة</th>
                <th className="p-3 md:p-5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 dark:text-zinc-400 font-bold">جاري التحميل...</td></tr>
              ) : trucks.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 dark:text-zinc-400 font-bold">لا توجد قواطر</td></tr>
              ) : (
                trucks.map(truck => (
                  <tr key={truck.id} className="border-b border-zinc-200 dark:border-titanium-800/50 hover:bg-zinc-50 dark:hover:bg-titanium-950/50 transition-colors">
                    <td data-label="رقم القاطرة" className="p-3 md:p-5 text-zinc-900 dark:text-white font-bold dir-ltr text-right sm:whitespace-nowrap">{truck.truck_number}</td>
                    <td data-label="السائق المربوط" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 font-medium sm:whitespace-nowrap">{truck.driver?.full_name || 'بدون سائق'}</td>
                    <td data-label="ملاحظات" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 ">{truck.notes || '-'}</td>
                    <td data-label="تاريخ الإضافة" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{new Date(truck.created_at).toLocaleDateString('ar-SA')}</td>
                    <td data-label="الحالة" className="p-3 md:p-5 sm:whitespace-nowrap">{getStatusBadge(truck.status)}</td>
                    <td data-label="الإجراءات" className="p-3 md:p-5 text-center sm:whitespace-nowrap space-x-3 space-x-reverse">
                      <button onClick={() => openEditModal(truck)} className="text-cyber-cyan hover:text-cyber-cyan/70 font-bold transition-colors">تعديل</button>
                      <button onClick={() => handleDelete(truck.id)} className="text-finance-red hover:text-finance-red/70 font-bold transition-colors">حذف</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-opacity">
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-[90vh] border border-zinc-200 dark:border-titanium-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">{isEditing ? 'تعديل بيانات القاطرة' : 'إضافة قاطرة جديدة'}</h3>
            {error && <div className="bg-finance-red/10 border border-finance-red/20 text-finance-red p-3 rounded-xl mb-6 text-sm font-bold">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1.5">رقم اللوحة / القاطرة</label>
                <input
                  type="text"
                  value={form.truck_number}
                  onChange={e => setForm({ ...form, truck_number: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 text-zinc-900 dark:text-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-cyber-indigo/20 focus:border-cyber-indigo outline-none transition-all duration-300"
                  placeholder="مثال: أ ب ج 1234"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1.5">السائق (اختياري)</label>
                <select
                  value={form.driver_id}
                  onChange={e => setForm({ ...form, driver_id: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 text-zinc-900 dark:text-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-cyber-indigo/20 focus:border-cyber-indigo outline-none transition-all duration-300"
                >
                  <option value="">-- بدون سائق --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1.5">الحالة</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 text-zinc-900 dark:text-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-cyber-indigo/20 focus:border-cyber-indigo outline-none transition-all duration-300"
                >
                  <option value="active">نشط</option>
                  <option value="maintenance">في الصيانة</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1.5">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 text-zinc-900 dark:text-white rounded-xl p-2 text-sm focus:ring-2 focus:ring-cyber-indigo/20 focus:border-cyber-indigo outline-none transition-all duration-300"
                  rows={3}
                />
              </div>
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
                className="flex-1 bg-zinc-50 dark:bg-titanium-950 hover:bg-zinc-200 dark:hover:bg-titanium-800 text-zinc-900 dark:text-white py-2 rounded-lg font-bold transition-all duration-300"
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

export default Trucks;
