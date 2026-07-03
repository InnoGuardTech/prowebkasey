const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace fixed min-widths with min-w-max to allow tables to shrink to their content size
  content = content.replace(/min-w-\[800px\]/g, 'w-full min-w-max');
  content = content.replace(/min-w-\[900px\]/g, 'w-full min-w-max');
  content = content.replace(/min-w-\[600px\]/g, 'w-full min-w-max');
  content = content.replace(/min-w-\[150px\]/g, ''); // Remove forced column widths
  content = content.replace(/min-w-\[200px\]/g, ''); 

  // Make table headers and cells tight on mobile
  content = content.replace(/whitespace-nowrap/g, 'sm:whitespace-nowrap'); // allow wrapping on mobile if needed, or keep nowrap if it breaks layout

  fs.writeFileSync(filePath, content);
}

console.log('Tables adjusted for mobile!');
