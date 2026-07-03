import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    password_hash: '',
    phone: '',
    role: 'accountant'
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: '', full_name: '', email: '', password_hash: '', phone: '', role: 'accountant' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setFormData({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      password_hash: '', // Leave blank to not change password
      phone: user.phone || '',
      role: user.role
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload: any = { ...formData };
      if (!payload.password_hash) {
        delete payload.password_hash;
      }

      if (isEditing) {
        await axios.patch(`/api/v1/users/${formData.id}`, payload, config);
      } else {
        await axios.post('/api/v1/users', payload, config);
      }
      closeModal();
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ المستخدم');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من إيقاف هذا المستخدم؟')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/v1/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        alert('فشل في إيقاف المستخدم');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">إدارة المستخدمين</h1>
        <button 
          onClick={openAddModal}
          className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
        >
          + إضافة مستخدم جديد
        </button>
      </div>

      <div className="glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden shadow-xl border border-zinc-200 dark:border-titanium-800">
        <div id="table-container" className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse responsive-table users-table">
            <thead className="bg-zinc-50 dark:bg-titanium-950/50">
              <tr>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap">الاسم الكامل</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap">البريد الإلكتروني</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap">الدور (Role)</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap">الحالة</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm text-center whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-titanium-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-titanium-950/50 transition-colors">
                  <td className="p-4 text-zinc-900 dark:text-white font-medium">{user.full_name}</td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400" dir="ltr">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      (user.role === 'admin' || user.role === 'manager') ? 'bg-cyber-indigo/10 text-cyber-indigo' :
                      user.role === 'accountant' ? 'bg-finance-green/10 text-finance-green' :
                      'bg-zinc-500/10 text-zinc-500 dark:text-zinc-300'
                    }`}>
                      {(user.role === 'admin' || user.role === 'manager') ? 'مدير' : user.role === 'accountant' ? 'محاسب' : 'سائق'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.is_active ? (
                      <span className="text-finance-green font-bold text-sm">نشط</span>
                    ) : (
                      <span className="text-finance-red font-bold text-sm">موقوف</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm font-medium">تعديل</button>
                    {user.is_active && (
                      <button onClick={() => handleDelete(user.id)} className="text-finance-red hover:text-red-700 text-sm font-medium">إيقاف</button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 dark:text-zinc-400">لا يوجد مستخدمين مسجلين</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">
          <div className="bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 sm:p-6 w-[88%] sm:w-full max-w-[340px] sm:max-w-md mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-popup overflow-y-auto max-h-[85vh] flex flex-col relative border border-zinc-100 dark:border-titanium-800">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{isEditing ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>
            
            {error && <div className="bg-finance-red/10 text-finance-red p-3 rounded-lg text-sm mb-4 font-bold">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-lg dark:text-white focus:ring-2 focus:ring-cyber-indigo outline-none"
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-lg dark:text-white focus:ring-2 focus:ring-cyber-indigo outline-none text-left"
                  dir="ltr"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">كلمة المرور {isEditing && <span className="text-xs text-zinc-400">(اتركها فارغة لعدم التغيير)</span>}</label>
                <input
                  type={isEditing ? "password" : "text"}
                  required={!isEditing}
                  className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-lg dark:text-white focus:ring-2 focus:ring-cyber-indigo outline-none text-left"
                  dir="ltr"
                  value={formData.password_hash}
                  onChange={e => setFormData({...formData, password_hash: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-lg dark:text-white focus:ring-2 focus:ring-cyber-indigo outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">الصلاحية (الدور)</label>
                <select
                  className="w-full p-3 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-lg dark:text-white focus:ring-2 focus:ring-cyber-indigo outline-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="accountant">محاسب</option>
                  <option value="driver">سائق</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-cyber-indigo hover:bg-cyber-indigo/90 text-white py-2 rounded-lg font-bold transition-colors">
                  {isEditing ? 'حفظ التعديلات' : 'إضافة المستخدم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
