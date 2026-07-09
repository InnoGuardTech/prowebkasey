import { useState, useEffect } from 'react';
import axios from 'axios';

interface Company {
  id: string;
  name: string;
  subdomain: string;
  logo_url: string;
  theme_colors: {
    primary: string;
    secondary: string;
  };
  status: string;
  created_at: string;
}

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    logo_url: '',
    primary_color: '#4338CA',
    secondary_color: '#06B6D4',
  });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل جلب الشركات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        name: company.name,
        subdomain: company.subdomain,
        logo_url: company.logo_url || '',
        primary_color: company.theme_colors?.primary || '#4338CA',
        secondary_color: company.theme_colors?.secondary || '#06B6D4',
      });
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        subdomain: '',
        logo_url: '',
        primary_color: '#4338CA',
        secondary_color: '#06B6D4',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        subdomain: formData.subdomain,
        logo_url: formData.logo_url,
        theme_colors: {
          primary: formData.primary_color,
          secondary: formData.secondary_color,
        }
      };

      if (editingCompany) {
        await axios.patch(`/api/v1/companies/${editingCompany.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/v1/companies', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء حفظ الشركة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف/إيقاف هذه الشركة؟')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err: any) {
      alert('فشل في حذف الشركة');
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">جاري التحميل...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">الشركات (Tenants)</h2>
          <p className="text-zinc-500 dark:text-zinc-400">إدارة العلامات البيضاء والمشتركين</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-tenant-primary text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-tenant-primary/30 transition-all active:scale-95"
        >
          + إضافة شركة جديدة
        </button>
      </div>

      {error && <div className="p-4 bg-finance-red/10 text-finance-red rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="glass-panel p-6 rounded-2xl relative group overflow-hidden">
            {/* Color preview background */}
            <div 
              className="absolute top-0 left-0 w-full h-2 opacity-80" 
              style={{ background: `linear-gradient(to right, ${company.theme_colors?.primary}, ${company.theme_colors?.secondary})` }}
            />
            
            <div className="flex justify-between items-start mb-6 mt-2">
              <div className="flex items-center gap-4">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="Logo" className="w-14 h-14 rounded-xl object-contain shadow-sm border border-zinc-100 dark:border-titanium-800 p-1 bg-white" />
                ) : (
                  <div className="w-14 h-14 rounded-xl shadow-sm border border-zinc-100 dark:border-titanium-800 flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: company.theme_colors?.primary || '#4338CA' }}>
                    {company.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{company.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-titanium-800 text-zinc-600 dark:text-zinc-300 rounded-md text-xs font-mono" dir="ltr">
                      {company.subdomain}.qiyada.com
                    </span>
                    {company.status === 'active' ? (
                      <span className="w-2 h-2 rounded-full bg-finance-green shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="نشط"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-finance-red shadow-[0_0_8px_rgba(244,63,94,0.5)]" title="موقوف"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6 border-t border-zinc-100 dark:border-titanium-800/50 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: company.theme_colors?.primary }}></div>
                <span>الأساسي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: company.theme_colors?.secondary }}></div>
                <span>الثانوي</span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleOpenModal(company)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-titanium-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors text-sm font-semibold"
              >
                تعديل وتخصيص
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="px-4 py-2 bg-finance-red/10 text-finance-red rounded-xl hover:bg-finance-red hover:text-white transition-colors text-sm font-semibold"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-titanium-900 rounded-2xl w-full max-w-xl shadow-2xl border border-zinc-200 dark:border-titanium-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-100 dark:border-titanium-800 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingCompany ? 'تعديل شركة' : 'إضافة شركة جديدة'}
              </h3>
              <p className="text-zinc-500 text-sm mt-1">تخصيص العلامة البيضاء والرابط للعميل</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="companyForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">اسم الشركة</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-xl focus:ring-2 focus:ring-tenant-primary outline-none transition-all dark:text-white"
                      placeholder="شركة الرواد اللوجستية"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">النطاق الفرعي (Subdomain)</label>
                    <div className="flex relative items-center">
                      <input
                        type="text"
                        required
                        value={formData.subdomain}
                        onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                        className="w-full pl-24 pr-4 py-2.5 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-xl focus:ring-2 focus:ring-tenant-primary outline-none transition-all dark:text-white text-left dir-ltr font-mono"
                        placeholder="alrowad"
                      />
                      <span className="absolute left-3 text-zinc-400 text-xs font-mono select-none" dir="ltr">.qiyada.com</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">رابط الشعار (Logo URL)</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 rounded-xl focus:ring-2 focus:ring-tenant-primary outline-none transition-all dark:text-white text-left dir-ltr"
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logo_url && (
                    <div className="mt-2 p-2 bg-zinc-50 dark:bg-titanium-950 rounded-lg inline-block border border-zinc-200 dark:border-titanium-800">
                      <img src={formData.logo_url} alt="Preview" className="h-10 object-contain" />
                    </div>
                  )}
                </div>

                <div className="p-5 border border-zinc-200 dark:border-titanium-800 rounded-xl bg-zinc-50/50 dark:bg-titanium-950/50">
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-4">الهوية البصرية (Theme Colors)</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">اللون الأساسي (Primary)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs font-mono bg-zinc-200 dark:bg-titanium-800 px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300 uppercase">
                          {formData.primary_color}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">اللون الثانوي (Secondary)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs font-mono bg-zinc-200 dark:bg-titanium-800 px-2 py-1 rounded-md text-zinc-700 dark:text-zinc-300 uppercase">
                          {formData.secondary_color}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Banner */}
                  <div className="mt-6 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-inner relative overflow-hidden group">
                    <div 
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to right, ${formData.primary_color}, ${formData.secondary_color})` }}
                    />
                    <span className="relative z-10 drop-shadow-md">معاينة الألوان المدمجة</span>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-zinc-100 dark:border-titanium-800 flex justify-end gap-3 shrink-0 bg-zinc-50 dark:bg-titanium-950/50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-zinc-600 dark:text-zinc-300 font-semibold hover:bg-zinc-200 dark:hover:bg-titanium-800 rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button
                form="companyForm"
                type="submit"
                className="px-8 py-2.5 bg-tenant-primary text-white font-bold rounded-xl shadow-lg shadow-tenant-primary/30 hover:opacity-90 transition-all active:scale-95"
              >
                حفظ الشركة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;
