const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Shrink inputs padding & font size
  content = content.replace(/rounded-xl p-3 focus:ring-2/g, 'rounded-xl p-2 text-sm focus:ring-2');
  content = content.replace(/rounded-xl p-3 /g, 'rounded-xl p-2 text-sm ');
  
  // Shrink space-y inside forms
  content = content.replace(/className="space-y-5"/g, 'className="space-y-3"');
  content = content.replace(/className="space-y-4"/g, 'className="space-y-3"');
  
  // Shrink labels margin and text size
  content = content.replace(/text-sm font-bold text-zinc-900 dark:text-white mb-2/g, 'text-xs font-bold text-zinc-900 dark:text-white mb-1.5');
  content = content.replace(/text-sm font-bold text-zinc-900 dark:text-white mb-1/g, 'text-xs font-bold text-zinc-900 dark:text-white mb-1');
  
  // Shrink modal container padding
  content = content.replace(/p-6 md:p-8/g, 'p-4 sm:p-6');
  content = content.replace(/p-5 sm:p-6/g, 'p-4 sm:p-6');
  
  // Make large slide-up modals smaller
  content = content.replace(/w-full max-w-lg/g, 'w-full max-w-sm sm:max-w-md');

  // Specific for Trips.tsx
  content = content.replace(/pb-10 sm:pb-6 sm:rounded-xl sm:rounded-xl p-6/g, 'pb-6 rounded-t-3xl sm:rounded-xl p-4 sm:p-6');
  
  fs.writeFileSync(filePath, content);
}
console.log('Forms compacted successfully!');
