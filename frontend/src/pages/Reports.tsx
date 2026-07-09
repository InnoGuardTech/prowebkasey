import { useState, useEffect, useMemo } from 'react';
import { exportToExcel, exportToPDF, printTable } from '../utils/exportUtils';

interface ReportRow {
  id: string;
  type: 'invoice' | 'expense';
  description: string;
  reference_number: string;
  truck_id: string;
  truck_number: string;
  driver_name: string;
  date: string;
  income: number;
  expense: number;
  net: number;
}

interface Truck {
  id: string;
  truck_number: string;
}

function Reports() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [selectedTruck, setSelectedTruck] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'invoice' | 'expense'>('all');

  useEffect(() => {
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

    Promise.all([
      fetch('/api/v1/invoices', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/v1/expenses', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
    .then(([invoicesRes, expensesRes]) => {
      const rows: ReportRow[] = [];
      
      const invs = invoicesRes.data || invoicesRes;
      const exps = expensesRes.data || expensesRes;

      invs.forEach((inv: any) => {
        rows.push({
          id: `inv-${inv.id}`,
          type: 'invoice',
          description: inv.description || 'إيراد',
          reference_number: inv.invoice_number || '-',
          truck_id: inv.truck?.id || '',
          truck_number: inv.truck?.truck_number || '-',
          driver_name: inv.driver?.user?.full_name || '-',
          date: inv.invoice_date,
          income: Number(inv.amount),
          expense: 0,
          net: Number(inv.amount)
        });
      });

      exps.forEach((exp: any) => {
        rows.push({
          id: `exp-${exp.id}`,
          type: 'expense',
          description: exp.notes || exp.category?.name || 'مصروف',
          reference_number: '-',
          truck_id: exp.truck?.id || '',
          truck_number: exp.truck?.truck_number || '-',
          driver_name: exp.driver?.user?.full_name || '-',
          date: exp.expense_date,
          income: 0,
          expense: Number(exp.amount),
          net: -Number(exp.amount)
        });
      });

      rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setData(rows);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (selectedTruck && row.truck_id !== selectedTruck) return false;
      if (typeFilter !== 'all' && row.type !== typeFilter) return false;
      if (startDate && new Date(row.date) < new Date(startDate)) return false;
      if (endDate && new Date(row.date) > new Date(endDate)) return false;
      return true;
    });
  }, [data, selectedTruck, startDate, endDate, typeFilter]);

  const summary = useMemo(() => {
    return filteredData.reduce((acc, row) => ({
      income: acc.income + row.income,
      expense: acc.expense + row.expense,
      net: acc.net + row.net
    }), { income: 0, expense: 0, net: 0 });
  }, [filteredData]);

  const fmt = (n: number) => n.toLocaleString('ar-SA', { minimumFractionDigits: 0 });

  const formatDate = (dateStr: string | null | undefined, locale: string = 'ar-SA') => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString(locale);
  };

  const handleExcelExport = () => {
    const rows = filteredData.map(r => ({
      'النوع': r.type === 'invoice' ? 'إيراد' : 'مصروف',
      'البيان': r.description,
      'رقم القاطرة': r.truck_number,
      'السائق': r.driver_name,
      'التاريخ': formatDate(r.date, 'ar-SA'),
      'الإيراد (ر.س)': r.income > 0 ? r.income : '',
      'المصروف (ر.س)': r.expense > 0 ? r.expense : '',
      'الصافي (ر.س)': r.net,
    }));
    exportToExcel(rows, 'التقرير_المالي', 'التقرير');
  };

  const handlePDFExport = async () => {
    setExporting(true);
    try {
      const columns = [
        { header: 'النوع', dataKey: 'type' },
        { header: 'البيان', dataKey: 'description' },
        { header: 'رقم القاطرة', dataKey: 'truck_number' },
        { header: 'السائق', dataKey: 'driver_name' },
        { header: 'التاريخ', dataKey: 'date' },
        { header: 'الإيراد (ر.س)', dataKey: 'income' },
        { header: 'المصروف (ر.س)', dataKey: 'expense' },
        { header: 'الصافي (ر.س)', dataKey: 'net' },
      ];
      const rows = filteredData.map(r => ({
        type: r.type === 'invoice' ? 'Inv' : 'Exp',
        description: r.description,
        truck_number: r.truck_number,
        driver_name: r.driver_name,
        date: formatDate(r.date, 'en-SA'),
        income: r.income > 0 ? fmt(r.income) : '-',
        expense: r.expense > 0 ? fmt(r.expense) : '-',
        net: fmt(r.net),
      }));
      await exportToPDF(columns, rows, 'التقرير_المالي', 'Financial Report - Qiyada', [
        { label: 'Total Income', value: `SAR ${fmt(summary.income)}` },
        { label: 'Total Expense', value: `SAR ${fmt(summary.expense)}` },
        { label: 'Net Profit', value: `SAR ${fmt(summary.net)}` },
      ]);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">التقارير المالية</h1>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button
            onClick={handleExcelExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            تصدير Excel
          </button>
          <button
            onClick={handlePDFExport}
            disabled={exporting}
            className="bg-finance-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md disabled:opacity-70"
          >
            {exporting ? 'جاري التصدير...' : 'تصدير PDF'}
          </button>
          <button
            onClick={() => printTable('التقرير المالي - Qiyada')}
            className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          >
            <span>🖨️</span> طباعة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 dark:bg-titanium-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-zinc-200/50 dark:border-titanium-800/50 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
          <select
            value={selectedTruck}
            onChange={e => setSelectedTruck(e.target.value)}
            className="border border-zinc-200 dark:border-titanium-800 bg-white dark:bg-titanium-900 dark:text-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cyber-indigo outline-none"
          >
            <option value="">جميع القواطر</option>
            {trucks.map(t => (
              <option key={t.id} value={t.id}>{t.truck_number}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="border border-zinc-200 dark:border-titanium-800 bg-white dark:bg-titanium-900 dark:text-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-cyber-indigo outline-none"
          >
            <option value="all">جميع العمليات</option>
            <option value="invoice">الإيرادات فقط</option>
            <option value="expense">المصروفات فقط</option>
          </select>

          <div className="flex items-center gap-2 bg-white dark:bg-titanium-900 border border-zinc-200 dark:border-titanium-800 rounded-xl px-3 py-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap font-bold">من:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-transparent p-1.5 text-sm focus:outline-none dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-titanium-900 border border-zinc-200 dark:border-titanium-800 rounded-xl px-3 py-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap font-bold">إلى:</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-transparent p-1.5 text-sm focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-finance-green/10 to-transparent rounded-2xl p-3 sm:p-5 text-center border border-finance-green/20 shadow-sm flex flex-col justify-center transition-all hover:scale-[1.02]">
          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-bold uppercase tracking-wider">إجمالي الإيرادات</p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-black text-finance-green drop-shadow-sm">{fmt(summary.income)}</p>
        </div>
        <div className="bg-gradient-to-br from-finance-red/10 to-transparent rounded-2xl p-3 sm:p-5 text-center border border-finance-red/20 shadow-sm flex flex-col justify-center transition-all hover:scale-[1.02]">
          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-bold uppercase tracking-wider">إجمالي المصروفات</p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-black text-finance-red drop-shadow-sm">{fmt(summary.expense)}</p>
        </div>
        <div className={`bg-gradient-to-br ${summary.net >= 0 ? 'from-cyber-cyan/10 border-cyber-cyan/20' : 'from-finance-red/10 border-finance-red/20'} to-transparent rounded-2xl p-3 sm:p-5 text-center border shadow-sm flex flex-col justify-center transition-all hover:scale-[1.02]`}>
          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-bold uppercase tracking-wider">صافي الربح</p>
          <p className={`text-lg sm:text-2xl lg:text-3xl font-black drop-shadow-sm ${summary.net >= 0 ? 'text-cyber-cyan' : 'text-finance-red'}`}>{fmt(summary.net)}</p>
        </div>
      </div>

      {/* Table */}
      <div id="report-table" className="bg-white/80 dark:bg-titanium-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-zinc-200/50 dark:border-titanium-800/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-50 dark:bg-titanium-950/50">
              <tr>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center w-[10%]">النوع</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm text-right w-[25%]">البيان</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">رقم القاطرة</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">السائق</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">التاريخ</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">الإيراد</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">المصروف</th>
                <th className="p-4 text-zinc-500 dark:text-zinc-400 font-semibold text-sm whitespace-nowrap text-center">الصافي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-titanium-800/50">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-500">جاري التحميل...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-500">لا توجد حركات مالية في هذه الفترة</td></tr>
              ) : (
                filteredData.map(row => (
                  <tr key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-titanium-950/50 transition-colors">
                    <td className="p-2 sm:p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.type === 'invoice' ? 'bg-finance-green/10 text-finance-green' : 'bg-finance-red/10 text-finance-red'
                      }`}>
                        {row.type === 'invoice' ? '↑ إيراد' : '↓ مصروف'}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-zinc-800 dark:text-zinc-200 text-right whitespace-normal break-words leading-relaxed text-sm">
                      <div className="line-clamp-2" title={row.description}>{row.description}</div>
                    </td>
                    <td className="p-2 sm:p-3 text-zinc-500 dark:text-zinc-400 font-mono text-sm text-center">{row.truck_number}</td>
                    <td className="p-2 sm:p-3 text-zinc-500 dark:text-zinc-400 text-sm max-w-[120px] truncate text-center" title={row.driver_name}>{row.driver_name}</td>
                    <td className="p-2 sm:p-3 text-zinc-500 dark:text-zinc-400 font-mono text-sm text-center">{formatDate(row.date, 'ar-SA')}</td>
                    <td className="p-2 sm:p-3 text-finance-green font-bold font-mono text-sm text-center">{row.income > 0 ? fmt(row.income) : '—'}</td>
                    <td className="p-2 sm:p-3 text-finance-red font-bold font-mono text-sm text-center">{row.expense > 0 ? fmt(row.expense) : '—'}</td>
                    <td className={`p-2 sm:p-3 font-bold font-mono text-sm text-center ${row.net >= 0 ? 'text-cyber-cyan' : 'text-finance-red'}`}>{fmt(row.net)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-zinc-100 dark:bg-titanium-900 border-t-2 border-zinc-300 dark:border-titanium-700">
                <tr>
                  <td colSpan={5} className="p-4 font-bold text-zinc-700 dark:text-zinc-300 text-sm">المجموع ({filteredData.length} سجل)</td>
                  <td className="p-4 font-bold text-finance-green">{fmt(summary.income)}</td>
                  <td className="p-4 font-bold text-finance-red">{fmt(summary.expense)}</td>
                  <td className={`p-4 font-bold text-lg ${summary.net >= 0 ? 'text-cyber-cyan' : 'text-finance-red'}`}>{fmt(summary.net)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
