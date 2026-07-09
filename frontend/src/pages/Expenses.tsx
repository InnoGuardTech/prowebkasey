import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { exportToExcel, printTable, exportToPDF } from '../utils/exportUtils';

interface Expense {
  id: string;
  amount: number;
  expense_date: string;
  notes: string;
  is_approved: boolean;
  truck?: { id: string; truck_number: string; driver?: { full_name: string } };
  category?: { id: string; name: string };
}

interface Truck {
  id: string;
  truck_number: string;
}

interface Category {
  id: string;
  name: string;
}

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', amount: '', notes: '', expense_date: '', truck_id: '', category_id: '' });
  const [error, setError] = useState('');

  const getRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'admin';
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).role;
    } catch(e) {
      return 'admin';
    }
  };
  const userRole = getRole();


  const fetchExpenses = () => {
    const token = localStorage.getItem('token');
    fetch(`/api/v1/expenses?page=${page}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setExpenses(data.data);
          setTotalPages(data.lastPage || 1);
        } else if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          setExpenses([]); // Prevents .map() crashes on bad responses (like 429)
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchTrucks = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/trucks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data)) {
          setTrucks(data.data);
        } else if (Array.isArray(data)) {
          setTrucks(data);
        } else {
          setTrucks([]);
        }
      })
      .catch(console.error);
  };

  const fetchCategories = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/expenses/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchExpenses();
    fetchTrucks();
    fetchCategories();
  }, []);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/expenses/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/expenses/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/expenses/${form.id}` : '/api/v1/expenses';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          notes: form.notes,
          expense_date: form.expense_date,
          truck_id: form.truck_id || null,
          category_id: form.category_id || null,
          amount: Number(form.amount)
        })
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل المصروف' : 'فشل في تسجيل المصروف');
      
      closeModal();
      fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ 
      id: '', amount: '', notes: '', 
      expense_date: new Date().toISOString().split('T')[0], 
      truck_id: '', category_id: '' 
    });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (expense: Expense) => {
    const dateFormatted = expense.expense_date ? new Date(expense.expense_date).toISOString().split('T')[0] : '';
    setForm({ 
      id: expense.id, 
      amount: String(expense.amount), 
      notes: expense.notes || '', 
      expense_date: dateFormatted, 
      truck_id: expense.truck?.id || '', 
      category_id: expense.category?.id || '' 
    });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = expenses.map(e => ({
      'رقم القاطرة': e.truck?.truck_number || '-',
      'السائق': e.truck?.driver?.full_name || '-',
      'الفئة': e.category?.name || '-',
      'البيان': e.notes,
      'القيمة (ر.س)': e.amount,
      'التاريخ': new Date(e.expense_date).toLocaleDateString('ar-SA'),
      'الاعتماد': e.is_approved ? 'معتمد' : 'بانتظار الاعتماد'
    }));
    exportToExcel(dataToExport, 'المصروفات', 'المصروفات');
  };

  const handleExportPDF = async () => {
    const columns = [
      { header: 'Truck', dataKey: 'truck' },
      { header: 'Driver', dataKey: 'driver' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Notes', dataKey: 'notes' },
      { header: 'Amount (SAR)', dataKey: 'amount' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = expenses.map(e => ({
      truck: e.truck?.truck_number || '-',
      driver: e.truck?.driver?.full_name || '-',
      category: e.category?.name || '-',
      notes: e.notes || '-',
      amount: Number(e.amount).toLocaleString('en'),
      date: new Date(e.expense_date).toLocaleDateString('en-SA'),
      status: e.is_approved ? 'Approved' : 'Pending',
    }));
    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    await exportToPDF(columns, rows, 'Expenses', 'Expenses Report - Qiyada', [
      { label: 'Total Records', value: String(expenses.length) },
      { label: 'Total Amount', value: `SAR ${total.toLocaleString('en')}` },
    ]);
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 no-print">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة المصروفات</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => printTable('المصروفات - Qiyada')}
            className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            طباعة
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-finance-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            PDF
          </button>
          <button
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            + تسجيل مصروف
          </button>
        </div>
      </div>
      <div id="table-container" className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full px-4 md:px-0">
          <table className="w-full text-right border-collapse responsive-table expenses-table">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">رقم القاطرة</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">السائق</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">فئة المصروف</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">بواسطة</th>
                <th className="p-3 md:p-5 font-medium ">البيان</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">القيمة</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">التاريخ</th>
                <th className="p-3 md:p-5 font-medium text-center">الاعتماد</th>
                <th className="p-3 md:p-5 font-medium text-center sm:whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-zinc-500 dark:text-zinc-400">جاري التحميل...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-zinc-500 dark:text-zinc-400">لا توجد مصروفات</td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950 transition-colors">
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 dir-ltr text-right sm:whitespace-nowrap">{expense.truck?.truck_number || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-900 dark:text-white sm:whitespace-nowrap text-xs">{expense.truck?.driver?.full_name || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-900 dark:text-white sm:whitespace-nowrap">{expense.category?.name || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 text-xs">{expense.creator?.full_name || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 ">{expense.notes}</td>
                    <td className="p-3 md:p-5 text-finance-red font-bold sm:whitespace-nowrap">{Number(expense.amount).toLocaleString('ar-SA')} ر.س</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{new Date(expense.expense_date).toLocaleDateString('ar-SA')}</td>
                    <td className="p-3 md:p-5 text-center">
                      {expense.is_approved ? (
                        <span className="bg-finance-green/10 text-finance-green px-3 py-1 rounded-full text-xs font-bold sm:whitespace-nowrap">معتمد</span>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold sm:whitespace-nowrap">بانتظار الاعتماد</span>
                          {userRole !== 'driver' && (
                          <div className="flex gap-1 mt-1">
                            <button onClick={() => handleApprove(expense.id)} className="bg-finance-green text-white px-2 py-1 rounded text-xs hover:bg-green-600">اعتماد</button>
                            <button onClick={() => handleReject(expense.id)} className="bg-finance-red text-white px-2 py-1 rounded text-xs hover:bg-red-700">رفض</button>
                          </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3 md:p-5 text-center sm:whitespace-nowrap">
                      {userRole !== 'driver' ? (
                        <>
                          <button onClick={() => openEditModal(expense)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل</button>
                          <button onClick={() => handleDelete(expense.id)} className="text-finance-red hover:text-red-700 text-sm">حذف</button>
                        </>
                      ) : (
                        <span className="text-zinc-400 text-xs">-</span>
                      )}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-popup overflow-y-auto max-h-[85vh] flex flex-col relative border border-zinc-100 dark:border-titanium-800">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل المصروف' : 'تسجيل مصروف جديد'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">القاطرة</label>
                <select
                  value={form.truck_id}
                  onChange={e => setForm({ ...form, truck_id: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                >
                  <option value="">-- اختر القاطرة --</option>
                  {trucks.map(t => (
                    <option key={t.id} value={t.id}>{t.truck_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">فئة المصروف</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                >
                  <option value="">-- اختر الفئة --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">البيان / الوصف</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  placeholder="مثال: تغيير زيت المحرك"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">القيمة (ر.س)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">التاريخ</label>
                  <input
                    type="date"
                    value={form.expense_date}
                    onChange={e => setForm({ ...form, expense_date: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  />
                </div>
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

export default Expenses;
