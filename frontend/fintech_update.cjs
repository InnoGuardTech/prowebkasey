const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

const replacements = {
  'bg-surface': 'bg-white dark:bg-titanium-900',
  'bg-background': 'bg-zinc-50 dark:bg-titanium-950',
  'border-border': 'border-zinc-200 dark:border-titanium-800',
  'text-text-muted': 'text-zinc-500 dark:text-zinc-400',
  'text-text': 'text-zinc-900 dark:text-white',
  'text-primary': 'text-cyber-cyan',
  'bg-primary': 'bg-cyber-indigo',
  'border-primary': 'border-cyber-indigo',
  'shadow-primary': 'shadow-cyber-cyan',
  'text-success': 'text-finance-green',
  'bg-success': 'bg-finance-green',
  'border-success': 'border-finance-green',
  'text-expense': 'text-finance-red',
  'bg-expense': 'bg-finance-red',
  'border-expense': 'border-finance-red',
  'shadow-expense': 'shadow-finance-red',
  'text-error': 'text-finance-red',
  'bg-error': 'bg-finance-red',
  'border-error': 'border-finance-red',
  'text-warning': 'text-amber-500',
  'bg-warning': 'bg-amber-500',
  'border-warning': 'border-amber-500',
  'rounded-3xl': 'rounded-xl',
  'rounded-2xl': 'rounded-xl',
  'font-extrabold': 'font-bold'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    // using regex to match exact words if possible, but simple replaceAll works since we don't have overlapping keys mostly
    // We should be careful about order. We replace -muted first.
    content = content.split(key).join(value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
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
