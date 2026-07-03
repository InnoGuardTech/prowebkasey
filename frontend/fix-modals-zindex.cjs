const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Increase Z-index for ALL modals to z-[100] to overlay everything (bottom nav, sidebar)
  content = content.replace(/z-50/g, 'z-[100]');
  
  // Make modals even smaller on mobile per user request (w-[85%] instead of w-[92%])
  content = content.replace(/w-\[92%\] sm:w-full max-w-sm/g, 'w-[88%] sm:w-full max-w-[340px]');
  content = content.replace(/w-\[92%\]/g, 'w-[88%]');
  
  fs.writeFileSync(filePath, content);
}
console.log('Modals z-index increased to 100 and made even smaller!');
