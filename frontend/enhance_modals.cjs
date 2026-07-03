const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace modal wrapper
  content = content.replace(
    /<div className="fixed inset-0 bg-black\/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">/g,
    `<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4 transition-all duration-300">`
  );

  // Replace modal inner box
  content = content.replace(
    /<div className="bg-white dark:bg-titanium-900 rounded-t-3xl pb-10 sm:pb-6 sm:rounded-xl sm:rounded-xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-\[90vh\]">/g,
    `<div className="bg-white dark:bg-titanium-900 rounded-t-[2rem] sm:rounded-2xl p-6 pb-24 sm:pb-8 sm:p-8 w-full max-w-lg shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-slide-up sm:animate-fade-in overflow-y-auto max-h-[95vh] flex flex-col relative">\n            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-6 sm:hidden shrink-0"></div>`
  );

  // Add close button to the modal header if not exists
  // We find the <h3> and put it in a flex container with a close button
  content = content.replace(
    /<h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">([^<]+)<\/h3>/g,
    (match, p1) => {
      return `<div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">${p1}</h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-titanium-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-titanium-700 transition-colors">✕</button>
            </div>`;
    }
  );

  // Remove the old cancel button from the bottom since we have an X at the top, or keep it but make it look better
  // Just make sure inputs are larger for mobile
  content = content.replace(/p-2 focus:ring-2/g, 'p-3 focus:ring-2'); // larger inputs

  fs.writeFileSync(filePath, content);
}

console.log('Modals enhanced for premium mobile experience!');
