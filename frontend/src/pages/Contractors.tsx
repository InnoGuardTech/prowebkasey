import { useState, useEffect } from 'react';

interface Contractor {
  id: string;
  name: string;
  phone: string;
  company_name: string;
  notes: string;
  is_active: boolean;
}

function Contractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', phone: '', company_name: '', notes: '', is_active: true });
  const [error, setError] = useState('');

  const fetchContractors = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/contractors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setContractors(data.data || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/contractors/${form.id}` : '/api/v1/contractors';
      const method = isEditing ? 'PATCH' : 'POST';

      const payload = { ...form };
      if (!isEditing) {
        delete (payload as any).id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل المقاول' : 'فشل في إضافة المقاول');
      
      closeModal();
      fetchContractors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', name: '', phone: '', company_name: '', notes: '', is_active: true });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (c: Contractor) => {
    setForm({ id: c.id, name: c.name, phone: c.phone || '', company_name: c.company_name || '', notes: c.notes || '', is_active: c.is_active });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من إيقاف هذا المقاول؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/contractors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: false })
      });
      fetchContractors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة المقاولين</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{contractors.length} مقاول مسجّل</p>
        </div>
        <button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >
          + إضافة مقاول
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full min-w-max">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">اسم المقاول</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">اسم الشركة</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">رقم التواصل</th>
                <th className="p-3 md:p-5 font-medium ">ملاحظات</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">الحالة</th>
                <th className="p-3 md:p-5 font-medium text-center sm:whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-zinc-500 dark:text-zinc-400">جاري التحميل...</td></tr>
              ) : contractors.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-zinc-500 dark:text-zinc-400">لا يوجد مقاولين</td></tr>
              ) : (
                contractors.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950 transition-colors">
                    <td className="p-3 md:p-5 font-medium text-zinc-900 dark:text-white sm:whitespace-nowrap">{c.name}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 sm:whitespace-nowrap">{c.company_name || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400 font-mono text-sm sm:whitespace-nowrap" dir="ltr">{c.phone || '-'}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400">{c.notes || '-'}</td>
                    <td className="p-3 md:p-5 sm:whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.is_active ? 'bg-finance-green/10 text-finance-green' : 'bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {c.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="p-3 md:p-5 text-center sm:whitespace-nowrap">
                      <button onClick={() => openEditModal(c)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل</button>
                      <button onClick={() => handleDelete(c.id)} className="text-finance-red hover:text-red-700 text-sm">إيقاف</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-popup overflow-y-auto max-h-[85vh] flex flex-col relative border border-zinc-100 dark:border-titanium-800">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل المقاول' : 'إضافة مقاول جديد'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">اسم المقاول (المندوب)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">اسم الشركة (اختياري)</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={e => setForm({ ...form, company_name: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">رقم التواصل</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none text-left dir-ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                />
              </div>
              {isEditing && (
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="is_active_contractor"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-cyber-cyan bg-zinc-50 dark:bg-titanium-950 border-zinc-200 dark:border-titanium-800 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_active_contractor" className="ml-2 rtl:mr-2 text-sm font-bold text-gray-900">
                    مقاول نشط
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

export default Contractors;
