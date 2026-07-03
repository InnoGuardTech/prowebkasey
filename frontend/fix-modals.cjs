const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix modal wrappers to center float instead of bottom-attach on mobile
  content = content.replace(/flex items-end sm:items-center/g, 'flex items-center');
  
  // Make modal corners fully rounded and add luxurious shadow
  content = content.replace(/rounded-t-3xl sm:rounded-xl/g, 'rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]');
  content = content.replace(/rounded-t-2xl sm:rounded-xl/g, 'rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]');
  content = content.replace(/rounded-2xl/g, 'rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]');
  
  // Optional: add a subtle elegant border if not present
  if (!content.includes('border-white/20')) {
    content = content.replace(/bg-white dark:bg-titanium-900/g, 'bg-white/95 dark:bg-titanium-900/95 backdrop-blur-xl border border-white/20 dark:border-titanium-700/50');
  }

  // Ensure modal isn't 100% width on mobile, give it some margin
  // Replace `w-full max-w-sm sm:max-w-md` with `w-[92%] sm:w-full max-w-sm sm:max-w-md`
  content = content.replace(/w-full max-w-sm sm:max-w-md/g, 'w-[92%] sm:w-full max-w-sm sm:max-w-md mx-auto');
  
  fs.writeFileSync(filePath, content);
}
console.log('Modals upgraded to ultra-luxurious floating style!');
