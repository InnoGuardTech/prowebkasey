const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace wrapper
  content = content.replace(
    /<div className="fixed inset-0 bg-black\/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-\[100\] p-0 sm:p-4 transition-all duration-300">/g,
    `<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 transition-all duration-300">`
  );

  // Replace box and remove drag handle
  content = content.replace(
    /<div className="bg-white dark:bg-titanium-900 rounded-t-\[2rem\] sm:rounded-2xl p-6 pb-24 sm:pb-8 sm:p-8 w-full max-w-lg shadow-\[0_-10px_40px_rgba\(0,0,0,0\.2\)\] animate-slide-up sm:animate-fade-in overflow-y-auto max-h-\[95vh\] flex flex-col relative">\n            <div className="w-12 h-1\.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6 sm:hidden shrink-0"><\/div>/g,
    `<div className="bg-white dark:bg-titanium-900 rounded-2xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-popup overflow-y-auto max-h-[85vh] flex flex-col relative border border-zinc-100 dark:border-titanium-800">`
  );
  
  // Also fix the padding for the title row
  content = content.replace(/mb-6 shrink-0/g, 'mb-4 shrink-0');

  // Also reduce spacing between inputs slightly
  content = content.replace(/space-y-4/g, 'space-y-3');
  
  // Reduce button padding slightly so it fits better
  content = content.replace(/py-3 rounded-xl/g, 'py-2 rounded-lg');

  fs.writeFileSync(filePath, content);
}

console.log('Modals changed to small center popups with animation!');
