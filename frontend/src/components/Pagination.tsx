import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 space-x-reverse mt-6 mb-2 print-hidden">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white dark:bg-titanium-900 border border-zinc-200 dark:border-titanium-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-titanium-800 transition-colors"
      >
        السابق
      </button>
      
      <div className="flex items-center space-x-1 space-x-reverse">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-cyber-indigo text-white shadow-sm'
                : 'bg-white dark:bg-titanium-900 border border-zinc-200 dark:border-titanium-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-titanium-800'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white dark:bg-titanium-900 border border-zinc-200 dark:border-titanium-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-titanium-800 transition-colors"
      >
        التالي
      </button>
    </div>
  );
};

export default Pagination;
