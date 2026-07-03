import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { exportToExcel, exportToPDF, printTable } from '../utils/exportUtils';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  invoice_date: string;
  status: string;
  description: string;
  truck?: { id: string; truck_number: string };
}

interface Truck {
  id: string;
  truck_number: string;
}

function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', invoice_number: '', amount: '', description: '', invoice_date: '', truck_id: '', status: 'pending' });
  const [error, setError] = useState('');

  const fetchInvoices = () => {
    const token = localStorage.getItem('token');
    fetch(`/api/v1/invoices?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setInvoices(data.data);
          setTotalPages(data.lastPage || 1);
        } else {
          setInvoices(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchTrucks = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/trucks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTrucks(data.data || data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchInvoices();
    fetchTrucks();
  }, []);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/invoices/${form.id}` : '/api/v1/invoices';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const payload: any = {
        invoice_number: form.invoice_number,
        description: form.description,
        amount: Number(form.amount),
        invoice_date: form.invoice_date,
        truck_id: form.truck_id || null,
        status: form.status,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل الفاتورة' : 'فشل في تسجيل الفاتورة');
      
      closeModal();
      fetchInvoices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', invoice_number: '', amount: '', description: '', invoice_date: '', truck_id: '', status: 'pending' });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (invoice: Invoice) => {
    // Make sure date is formatted correctly for date input (YYYY-MM-DD)
    const dateFormatted = invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split('T')[0] : '';
    setForm({ 
      id: invoice.id, 
      invoice_number: invoice.invoice_number, 
      amount: String(invoice.amount), 
      description: invoice.description || '', 
      invoice_date: dateFormatted, 
      truck_id: invoice.truck?.id || '', 
      status: invoice.status || 'pending'
    });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="bg-finance-green/10 text-finance-green px-3 py-1 rounded-full text-xs font-bold">مسددة</span>;
      case 'pending':
        return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">بانتظار السداد</span>;
      case 'overdue':
        return <span className="bg-finance-red/10 text-finance-red px-3 py-1 rounded-full text-xs font-bold">متأخرة</span>;
      default:
        return <span className="bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const handleExportExcel = () => {
    const rows = invoices.map(inv => ({
      'رقم الفاتورة': inv.invoice_number,
      'القاطرة': inv.truck?.truck_number || '-',
      'البيان': inv.description,
      'المبلغ (ر.س)': inv.amount,
      'التاريخ': new Date(inv.invoice_date).toLocaleDateString('ar-SA'),
      'الحالة': inv.status === 'paid' ? 'مسددة' : inv.status === 'overdue' ? 'متأخرة' : 'بانتظار السداد',
    }));
    exportToExcel(rows, 'الفواتير_والإيرادات', 'الفواتير');
  };

  const handleExportPDF = async () => {
    const columns = [
      { header: 'Invoice #', dataKey: 'invoice_number' },
      { header: 'Truck', dataKey: 'truck' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount (SAR)', dataKey: 'amount' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = invoices.map(inv => ({
      invoice_number: inv.invoice_number,
      truck: inv.truck?.truck_number || '-',
      description: inv.description || '-',
      amount: Number(inv.amount).toLocaleString('en'),
      date: new Date(inv.invoice_date).toLocaleDateString('en-SA'),
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'overdue' ? 'Overdue' : 'Pending',
    }));
    const total = invoices.reduce((s, inv) => s + Number(inv.amount), 0);
    await exportToPDF(columns, rows, 'Invoices', 'Invoices Report - Prokasey', [
      { label: 'Total Invoices', value: String(invoices.length) },
      { label: 'Total Revenue', value: `SAR ${total.toLocaleString('en')}` },
    ]);
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة الفواتير والإيرادات</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => printTable('الفواتير - Prokasey')}
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
            + تسجيل إيراد / فاتورة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full min-w-max px-4 md:px-0">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">رقم الفاتورة</th>
                <th className="p-3 md:p-5 font-medium">القاطرة</th>
                <th className="p-3 md:p-5 font-medium">البيان</th>
                <th className="p-3 md:p-5 font-medium">القيمة</th>
                <th className="p-3 md:p-5 font-medium">التاريخ</th>
                <th className="p-3 md:p-5 font-medium">الحالة</th>
                <th className="p-3 md:p-5 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center text-zinc-500 dark:text-zinc-400">جاري التحميل...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-zinc-500 dark:text-zinc-400">لا توجد فواتير</td></tr>
              ) : (
                invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950 transition-colors">
                    <td data-label="رقم الفاتورة" className="p-3 md:p-5 text-zinc-900 dark:text-white font-medium dir-ltr text-right sm:whitespace-nowrap">{invoice.invoice_number}</td>
                    <td data-label="القاطرة" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{invoice.truck?.truck_number || '-'}</td>
                    <td data-label="البيان" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 ">{invoice.description}</td>
                    <td data-label="القيمة" className="p-3 md:p-5 text-zinc-900 dark:text-white font-bold sm:whitespace-nowrap">{Number(invoice.amount).toLocaleString('ar-SA')} ر.س</td>
                    <td data-label="التاريخ" className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{new Date(invoice.invoice_date).toLocaleDateString('ar-SA')}</td>
                    <td data-label="الحالة" className="p-3 md:p-5 sm:whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                    <td data-label="الإجراءات" className="p-3 md:p-5 text-center sm:whitespace-nowrap">
                      <button onClick={() => openEditModal(invoice)} className="text-blue-500 hover:text-blue-700 ml-3">تعديل</button>
                      <button onClick={() => handleDelete(invoice.id)} className="text-finance-red hover:text-red-700">حذف</button>
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
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل الفاتورة' : 'تسجيل إيراد / فاتورة'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">رقم الفاتورة (المرجعي)</label>
                <input
                  type="text"
                  value={form.invoice_number}
                  onChange={e => setForm({ ...form, invoice_number: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  placeholder="مثال: INV-1029"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">القاطرة (اختياري)</label>
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
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">البيان / الوصف</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  placeholder="مثال: نقل بضائع للرياض"
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
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={form.invoice_date}
                    onChange={e => setForm({ ...form, invoice_date: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  />
                </div>
              </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">الحالة</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  >
                    <option value="pending">بانتظار السداد</option>
                    <option value="paid">مسددة</option>
                    <option value="overdue">متأخرة</option>
                  </select>
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

export default Invoices;
