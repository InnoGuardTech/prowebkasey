import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiAlertCircle, FiClock, FiFileText } from 'react-icons/fi';

interface DashboardData {
  activeTrucks: number;
  totalIncome: number;
  totalExpenses: number;
  pendingExpenses: number;
  netProfit: number;
  chartData: { name: string; income: number; expense: number }[];
}

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchStats = fetch('/api/v1/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    });
    const fetchAlerts = fetch('/api/v1/dashboard/alerts', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    });

    Promise.all([fetchStats, fetchAlerts])
      .then(([stats, alertsData]) => {
        setData(stats);
        setAlerts(alertsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-indigo"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-zinc-500 dark:text-zinc-400 p-6">فشل في تحميل البيانات</div>;
  }

  const chartData = data.chartData.map(d => ({
    name: d.name,
    'الدخل': d.income,
    'المصروفات': d.expense,
  }));

  const fmt = (n: number) => n.toLocaleString('ar-SA');

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-titanium-900/90 backdrop-blur-xl p-6 rounded-xl border border-zinc-200 dark:border-titanium-800 transition-all duration-300 relative overflow-hidden group hover:dark:shadow-glow-cyan hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-3 relative z-10">القواطر النشطة</h3>
          <p className="font-numbers text-4xl font-bold text-zinc-900 dark:text-white relative z-10">{data.activeTrucks}</p>
        </div>
        
        <div className="bg-white dark:bg-titanium-900/90 backdrop-blur-xl p-6 rounded-xl border border-zinc-200 dark:border-titanium-800 transition-all duration-300 relative overflow-hidden group dark:shadow-glow-cyan hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-3 relative z-10">إجمالي الإيرادات</h3>
          <p className="font-numbers text-4xl font-bold text-cyber-cyan relative z-10">{fmt(data.totalIncome)} <span className="font-arabic text-lg text-cyber-cyan/70">ر.س</span></p>
        </div>
        
        <div className="bg-white dark:bg-titanium-900/90 backdrop-blur-xl p-6 rounded-xl border border-zinc-200 dark:border-titanium-800 transition-all duration-300 relative overflow-hidden group dark:shadow-glow-red hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-finance-red/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-bold mb-3 relative z-10">إجمالي المصروفات</h3>
          <p className="font-numbers text-4xl font-bold text-finance-red relative z-10">{fmt(data.totalExpenses)} <span className="font-arabic text-lg text-finance-red/70">ر.س</span></p>
          {data.pendingExpenses > 0 && (
            <p className="font-numbers text-xs text-amber-500 mt-3 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl font-bold relative z-10 shadow-sm"><span className="font-arabic">⏳ مصروف بانتظار الاعتماد</span> {data.pendingExpenses}</p>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-cyber-indigo to-cyber-cyan p-6 rounded-xl border border-cyber-cyan/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden text-white group shadow-xl dark:shadow-glow-green">
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <h3 className="text-white/80 text-sm font-bold mb-3 relative z-10">صافي الربح</h3>
          <p className="font-numbers text-4xl font-bold relative z-10">
            {fmt(data.netProfit)} <span className="font-arabic text-lg text-white/70">ر.س</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-titanium-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-xl shadow-cyber-cyan/5 border border-white/50">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-8">مقارنة الإيرادات والمصروفات</h3>
          <div className="h-[350px] dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-income-light)" stopOpacity={1}/>
                    <stop offset="95%" stopColor="var(--chart-income)" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-expense)" stopOpacity={1}/>
                    <stop offset="95%" stopColor="var(--chart-expense)" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-text)', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-text)', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: 'var(--chart-income)', opacity: 0.05 }} contentStyle={{ backgroundColor: 'var(--color-surface, #18181B)', borderColor: 'var(--chart-grid)', borderRadius: '16px', color: 'var(--chart-text)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                <Bar dataKey="الدخل" fill="url(#colorIncome)" radius={[8, 8, 0, 0]} maxBarSize={45} />
                <Bar dataKey="المصروفات" fill="url(#colorExpense)" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white dark:bg-titanium-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-xl shadow-finance-red/5 border border-finance-red/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-finance-red/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
            <FiAlertCircle className="text-finance-red" /> تنبيهات الوثائق الذكية
            {alerts.length > 0 && (
              <span className="bg-finance-red text-white text-xs px-2 py-1 rounded-full font-numbers ml-auto">{alerts.length}</span>
            )}
          </h3>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar relative z-10 pr-2">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
                <FiFileText className="mx-auto text-4xl mb-3 opacity-50" />
                <p>جميع الوثائق سارية المفعول.</p>
              </div>
            ) : (
              alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2 transition-all hover:-translate-y-1 ${alert.critical ? 'bg-finance-red/10 border-finance-red/30 text-finance-red' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold flex items-center gap-2">
                      <FiAlertCircle /> {alert.title}
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/50 dark:bg-black/50">
                      {alert.critical ? 'منتهية/حرجة' : 'قريباً'}
                    </span>
                  </div>
                  <p className="text-sm flex items-center gap-2 font-numbers font-bold">
                    <FiClock /> {new Date(alert.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
