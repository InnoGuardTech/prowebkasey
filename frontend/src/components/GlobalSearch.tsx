import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  trucks: { type: string; id: string; label: string; sub: string }[];
  invoices: { type: string; id: string; label: string; sub: string }[];
  expenses: { type: string; id: string; label: string; sub: string }[];
}

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults(null); setIsOpen(false); return; }
    const token = localStorage.getItem('token');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch { setResults(null); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const icons: Record<string, string> = { truck: '🚛', invoice: '💰', expense: '💸' };
  const labels: Record<string, string> = { truck: 'قاطرة', invoice: 'فاتورة', expense: 'مصروف' };

  const allResults = results
    ? [...(results.trucks || []), ...(results.invoices || []), ...(results.expenses || [])]
    : [];

  const handleSelect = (type: string) => {
    setQuery('');
    setIsOpen(false);
    if (type === 'truck') navigate('/trucks');
    else if (type === 'invoice') navigate('/invoices');
    else if (type === 'expense') navigate('/expenses');
  };

  return (
    <div ref={ref} className="relative z-50">
      <div className="relative">
        <span className="absolute inset-y-0 right-3 flex items-center text-zinc-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="بحث سريع... (قاطرة، فاتورة، مصروف)"
          className="w-full sm:w-72 bg-zinc-100 dark:bg-titanium-800 border border-transparent focus:border-cyber-indigo rounded-xl pr-10 pl-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyber-indigo/30 transition-all duration-300"
        />
      </div>
      {isOpen && allResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full sm:w-80 left-0 sm:left-auto sm:right-0 bg-white dark:bg-titanium-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-titanium-800 overflow-hidden animate-popup">
          {allResults.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r.type)}
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 hover:bg-zinc-50 dark:hover:bg-titanium-800 transition-colors text-right border-b last:border-0 border-zinc-100 dark:border-titanium-800/50"
            >
              <div className="w-10 h-10 rounded-full bg-cyber-indigo/10 flex items-center justify-center text-xl shrink-0">
                {icons[r.type]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{r.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{labels[r.type]} · {r.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {isOpen && allResults.length === 0 && (
        <div className="absolute top-full mt-2 w-full sm:w-80 left-0 sm:left-auto sm:right-0 bg-white dark:bg-titanium-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-titanium-800 px-4 py-6 animate-popup">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center flex flex-col items-center gap-2">
            <span className="text-2xl">📭</span>
            لا توجد نتائج مطابقة لبحثك
          </p>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
