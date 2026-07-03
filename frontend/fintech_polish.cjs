const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

const replacements = {
  'focus:ring-primary/20': 'focus:ring-cyber-indigo/20',
  'focus:border-primary': 'focus:border-cyber-indigo',
  'hover:bg-border': 'hover:bg-zinc-200 dark:hover:bg-titanium-800',
  'bg-border': 'bg-zinc-200 dark:bg-titanium-800',
  'dark:bg-titanium-950/50 hover:bg-zinc-50': 'hover:bg-zinc-50 dark:hover:bg-titanium-950/50', // Fix table row hovers
  'dark:bg-titanium-950/50': 'dark:hover:bg-titanium-950/50', // Fallback for table row hover fix
  'backdrop-blur-sm flex items-end sm:items-center': 'backdrop-blur-md flex items-end sm:items-center', // Upgrade modal blur
  'hover:-translate-y-0.5': 'hover:-translate-y-0.5 active:scale-95', // Add click animation to buttons
  'transition-all': 'transition-all duration-300', // Ensure smooth transitions
  'duration-300 duration-300': 'duration-300', // Fix accidental duplicates
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Specific regex for table rows to ensure smooth hover and numbers font where dates/amounts exist
  content = content.replace(/hover:bg-zinc-50 dark:bg-titanium-950\/50 transition-colors/g, 'hover:bg-zinc-50 dark:hover:bg-titanium-950/50 transition-colors');
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Polished ${filePath}`);
  }
}

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        processFile(path.join(dir, file));
      }
    });
  }
});
