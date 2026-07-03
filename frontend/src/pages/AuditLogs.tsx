import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
  user?: { full_name: string };
}

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/audit-logs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const actionColors: Record<string, string> = {
    CREATE: 'bg-finance-green/10 text-finance-green',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-finance-red/10 text-finance-red',
    APPROVE: 'bg-purple-100 text-purple-700',
    REJECT: 'bg-amber-500/10 text-amber-500',
  };

  const actionLabels: Record<string, string> = {
    CREATE: 'إنشاء',
    UPDATE: 'تعديل',
    DELETE: 'حذف',
    APPROVE: 'اعتماد',
    REJECT: 'رفض',
  };

  return (
    <div className="bg-white dark:bg-titanium-900 rounded-xl shadow-sm border border-zinc-200 dark:border-titanium-800 p-6">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">سجل التدقيق</h2>
      {loading ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-10">جاري التحميل...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-10">لا توجد سجلات</div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const userName = log.user?.full_name || 'مستخدم غير معروف';
            const actionLabel = actionLabels[log.action] || log.action;
            const actionColor = actionColors[log.action] || 'bg-zinc-50 dark:bg-titanium-950 text-zinc-500 dark:text-zinc-400';
            
            return (
              <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-titanium-950 border border-zinc-200 dark:border-titanium-800 hover:border-cyber-indigo/20 transition-colors gap-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-cyber-indigo/10 rounded-full flex items-center justify-center text-cyber-cyan font-bold text-sm shrink-0">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      <span className="text-cyber-cyan">{userName}</span>
                      {' قام بـ '}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${actionColor}`}>
                        {actionLabel}
                      </span>
                      {` ${log.entity_type} `}
                      <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">({log.entity_id})</span>
                    </p>
                    {log.details && log.details !== '{}' && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1" dir="ltr">{log.details}</p>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-sm sm:whitespace-nowrap md:self-start">
                  {new Date(log.created_at).toLocaleString('ar-SA')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
