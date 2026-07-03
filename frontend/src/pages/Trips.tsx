import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { exportToExcel, printTable, exportToPDF } from '../utils/exportUtils';
import { FiDownload, FiPrinter, FiMapPin, FiCalendar, FiTruck } from 'react-icons/fi';

interface Trip {
  id: string;
  trip_number: string;
  start_date: string;
  end_date: string | null;
  status: string;
  route: string;
  notes: string;
  truck?: { id: string; truck_number: string };
  driver?: { id: string; full_name: string };
}

interface Truck { id: string; truck_number: string; }
interface Driver { id: string; full_name: string; }

function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', trip_number: '', truck_id: '', driver_id: '', start_date: '', end_date: '', status: 'active', route: '', notes: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [tripsRes, trucksRes, driversRes] = await Promise.all([
        fetch(`/api/v1/trips?page=${page}`, { headers }),
        fetch('/api/v1/trucks', { headers }),
        fetch('/api/v1/users', { headers })
      ]);
      const [tripsData, trucksData, usersData] = await Promise.all([
        tripsRes.json(), trucksRes.json(), driversRes.json()
      ]);
      setTrips(tripsData.data || tripsData);
      setTrucks(trucksData.data || trucksData);
      setDrivers((usersData.data || usersData).filter((u: any) => u.role === 'driver'));
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/trips/${form.id}` : '/api/v1/trips';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          trip_number: form.trip_number,
          truck_id: form.truck_id,
          driver_id: form.driver_id || null,
          start_date: form.start_date,
          end_date: form.end_date || null,
          status: form.status,
          route: form.route,
          notes: form.notes
        })
      });
      if (!res.ok) throw new Error('فشل في حفظ بيانات الرحلة');
      
      closeModal();
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', trip_number: `TRP-${Date.now().toString().slice(-6)}`, truck_id: '', driver_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '', status: 'active', route: '', notes: '' });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (trip: Trip) => {
    setForm({ 
      id: trip.id, 
      trip_number: trip.trip_number,
      truck_id: trip.truck?.id || '', 
      driver_id: trip.driver?.id || '', 
      start_date: trip.start_date ? new Date(trip.start_date).toISOString().split('T')[0] : '', 
      end_date: trip.end_date ? new Date(trip.end_date).toISOString().split('T')[0] : '', 
      status: trip.status || 'active',
      route: trip.route || '',
      notes: trip.notes || ''
    });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرحلة؟')) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/v1/trips/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const handleExportExcel = () => {
    const dataToExport = trips.map(t => ({
      'رقم الرحلة': t.trip_number,
      'القاطرة': t.truck?.truck_number || '-',
      'السائق': t.driver?.full_name || '-',
      'خط السير': t.route || '-',
      'الحالة': t.status === 'active' ? 'نشطة' : t.status === 'completed' ? 'مكتملة' : 'ملغاة',
      'تاريخ البدء': new Date(t.start_date).toLocaleDateString('ar-SA')
    }));
    exportToExcel(dataToExport, 'الرحلات', 'الرحلات');
  };

  const handleExportPDF = async () => {
    const columns = [
      { header: 'Trip #', dataKey: 'trip_number' },
      { header: 'Truck', dataKey: 'truck' },
      { header: 'Driver', dataKey: 'driver' },
      { header: 'Route', dataKey: 'route' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = trips.map(t => ({
      trip_number: t.trip_number,
      truck: t.truck?.truck_number || '-',
      driver: t.driver?.full_name || '-',
      route: t.route || '-',
      date: new Date(t.start_date).toLocaleDateString('en-SA'),
      status: t.status === 'active' ? 'Active' : t.status === 'completed' ? 'Completed' : 'Cancelled',
    }));
    await exportToPDF(columns, rows, 'Trips', 'Trips Report - Prokasey', [
      { label: 'Total Trips', value: String(trips.length) },
      { label: 'Active Trips', value: String(trips.filter(t => t.status === 'active').length) },
    ]);
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2"><FiMapPin className="text-cyber-indigo" /> إدارة الرحلات</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => printTable('الرحلات - Prokasey')} className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">طباعة</button>
          <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">Excel</button>
          <button onClick={handleExportPDF} className="bg-finance-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">PDF</button>
          <button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >+ إضافة رحلة</button>
        </div>
      </div>
      
      <div id="table-container" className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full px-4 md:px-0">
          <table className="w-full text-right border-collapse responsive-table trips-table">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">رقم الرحلة</th>
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">القاطرة</th>
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">السائق</th>
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">خط السير</th>
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">تاريخ البدء</th>
                <th className="p-3 sm:p-4 font-medium sm:whitespace-nowrap">الحالة</th>
                <th className="p-4 font-medium text-center no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center text-zinc-500">جاري التحميل...</td></tr>
              ) : trips.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-zinc-500">لا توجد رحلات</td></tr>
              ) : trips.map(trip => (
                <tr key={trip.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950">
                  <td data-label="رقم الرحلة" className="p-4 font-numbers font-bold text-cyber-indigo">{trip.trip_number}</td>
                  <td data-label="القاطرة" className="p-3 sm:p-4 sm:whitespace-nowrap"><div className="flex items-center gap-2"><FiTruck className="text-zinc-400"/> {trip.truck?.truck_number || '-'}</div></td>
                  <td data-label="السائق" className="p-3 sm:p-4 sm:whitespace-nowrap">{trip.driver?.full_name || '-'}</td>
                  <td data-label="خط السير" className="p-3 sm:p-4 sm:whitespace-nowrap">{trip.route || '-'}</td>
                  <td data-label="تاريخ البدء" className="p-3 sm:p-4 sm:whitespace-nowrap"><div className="flex items-center gap-2 font-numbers"><FiCalendar className="text-zinc-400"/> {new Date(trip.start_date).toLocaleDateString('ar-SA')}</div></td>
                  <td data-label="الحالة" className="p-3 sm:p-4 sm:whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'active' ? 'bg-cyber-cyan/10 text-cyber-cyan' : trip.status === 'completed' ? 'bg-finance-green/10 text-finance-green' : 'bg-finance-red/10 text-finance-red'}`}>
                      {trip.status === 'active' ? 'نشطة' : trip.status === 'completed' ? 'مكتملة' : 'ملغاة'}
                    </span>
                  </td>
                  <td data-label="الإجراءات" className="p-4 text-center no-print">
                    <button onClick={() => openEditModal(trip)} className="text-blue-500 hover:text-blue-700 ml-3">تعديل</button>
                    <button onClick={() => handleDelete(trip.id)} className="text-finance-red hover:text-red-700">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white dark:bg-titanium-900 rounded-t-3xl pb-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</h3>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold mb-1">رقم الرحلة</label>
                <input type="text" value={form.trip_number} onChange={e => setForm({...form, trip_number: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-zinc-50 dark:bg-titanium-950 rounded-lg p-2 font-numbers" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">القاطرة</label>
                  <select value={form.truck_id} onChange={e => setForm({...form, truck_id: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-transparent rounded-lg p-2">
                    <option value="">اختر القاطرة</option>
                    {trucks.map(t => <option key={t.id} value={t.id} className="text-black">{t.truck_number}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">السائق</label>
                  <select value={form.driver_id} onChange={e => setForm({...form, driver_id: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-transparent rounded-lg p-2">
                    <option value="">اختر السائق</option>
                    {drivers.map(d => <option key={d.id} value={d.id} className="text-black">{d.full_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">خط السير</label>
                <input type="text" value={form.route} onChange={e => setForm({...form, route: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-transparent rounded-lg p-2" placeholder="مثال: الرياض -> جدة" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">تاريخ البدء</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-transparent rounded-lg p-2 font-numbers" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">الحالة</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-zinc-200 dark:border-titanium-800 bg-transparent rounded-lg p-2">
                    <option value="active" className="text-black">نشطة</option>
                    <option value="completed" className="text-black">مكتملة</option>
                    <option value="cancelled" className="text-black">ملغاة</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={handleSave} className="flex-1 bg-cyber-indigo text-white py-2 rounded-lg font-bold hover:-translate-y-1 transition-transform">حفظ</button>
              <button onClick={closeModal} className="flex-1 bg-zinc-100 dark:bg-titanium-800 py-2 rounded-lg font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trips;
