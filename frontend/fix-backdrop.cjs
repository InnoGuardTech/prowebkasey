const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Revert the root container background and remove backdrop-blur (which traps fixed elements)
  content = content.replace(/bg-white\/95 dark:bg-titanium-900\/95 backdrop-blur-xl border border-white\/20 dark:border-titanium-700\/50 (rounded-xl shadow-sm)/g, 'bg-white dark:bg-titanium-900 $1');
  
  content = content.replace(/bg-white\/95 dark:bg-titanium-900\/95 backdrop-blur-xl border border-white\/20 dark:border-titanium-700\/50 (rounded-2xl p-5)/g, 'bg-white dark:bg-titanium-900 $1');

  // Let's just blindly replace it everywhere EXCEPT where it's followed by `rounded-3xl`
  // Actually, a regex with negative lookahead is safer:
  content = content.replace(/bg-white\/95 dark:bg-titanium-900\/95 backdrop-blur-xl border border-white\/20 dark:border-titanium-700\/50(?!\s+rounded-3xl)/g, 'bg-white dark:bg-titanium-900');
  
  fs.writeFileSync(filePath, content);
}
console.log('Fixed containing block issue by removing backdrop-blur from non-modals!');
