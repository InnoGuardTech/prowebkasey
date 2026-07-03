import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
}

function ExpenseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', description: '', color: '#3B82F6', is_active: true });
  const [error, setError] = useState('');

  const fetchCategories = () => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/expenses/categories', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const list = (data && data.data && Array.isArray(data.data)) ? data.data : (Array.isArray(data) ? data : []);
        setCategories(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const url = isEditing ? `/api/v1/expenses/categories/${form.id}` : '/api/v1/expenses/categories';
      const method = isEditing ? 'PATCH' : 'POST';

      const payload = { ...form };
      if (!isEditing) delete payload.id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(isEditing ? 'فشل في تعديل الفئة' : 'فشل في إضافة الفئة');
      
      closeModal();
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setForm({ id: '', name: '', description: '', color: '#3B82F6', is_active: true });
    setIsEditing(false);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setForm({ id: cat.id, name: cat.name, description: cat.description || '', color: cat.color || '#3B82F6', is_active: cat.is_active });
    setIsEditing(true);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/v1/expenses/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">إدارة فئات المصروفات</h2>
        <button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >
          + إضافة فئة
        </button>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="w-full min-w-max px-4 md:px-0">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-titanium-950 border-b border-zinc-200 dark:border-titanium-800 text-zinc-500 dark:text-zinc-400 text-sm">
                <th className="p-3 md:p-5 font-medium w-16">اللون</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">اسم الفئة</th>
                <th className="p-3 md:p-5 font-medium ">الوصف</th>
                <th className="p-3 md:p-5 font-medium sm:whitespace-nowrap">الحالة</th>
                <th className="p-3 md:p-5 font-medium text-center sm:whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center text-zinc-500 dark:text-zinc-400">جاري التحميل...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-zinc-500 dark:text-zinc-400">لا توجد فئات</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="border-b border-zinc-200 dark:border-titanium-800 hover:bg-zinc-50 dark:bg-titanium-950 transition-colors">
                    <td className="p-3 md:p-5">
                      <div className="w-6 h-6 rounded-full border border-zinc-200 dark:border-titanium-800" style={{ backgroundColor: cat.color || '#999' }}></div>
                    </td>
                    <td className="p-3 md:p-5 text-zinc-900 dark:text-white font-medium sm:whitespace-nowrap">{cat.name}</td>
                    <td className="p-3 md:p-5 text-zinc-500 dark:text-zinc-400">{cat.description || '-'}</td>
                    <td className="p-3 md:p-5 sm:whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cat.is_active ? 'bg-finance-green/10 text-finance-green' : 'bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {cat.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="p-3 md:p-5 text-center sm:whitespace-nowrap">
                      <button onClick={() => openEditModal(cat)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-finance-red hover:text-red-700 text-sm">حذف</button>
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
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-2xl animate-slide-up sm:animate-fade-in">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            {error && <div className="bg-finance-red/10 text-finance-red p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">اسم الفئة</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  placeholder="مثال: صيانة دورية"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">الوصف</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-zinc-200 dark:border-titanium-800 rounded-lg p-3 focus:ring-2 focus:border-cyber-indigo outline-none"
                  placeholder="اختياري"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">اللون المميز (للعرض)</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-full h-12 rounded cursor-pointer"
                />
              </div>
              {isEditing && (
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 text-cyber-cyan bg-zinc-50 dark:bg-titanium-950 border-zinc-200 dark:border-titanium-800 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_active" className="ml-2 rtl:mr-2 text-sm font-bold text-gray-900">
                    نشط
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

export default ExpenseCategories;
