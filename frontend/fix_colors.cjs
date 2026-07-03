const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any button that has onClick={openAddModal} and some generic color classes
  // with the new cyber-indigo button design
  content = content.replace(
    /<button\s+onClick=\{openAddModal\}\s+className="[^"]+"\s*>/g,
    `<button 
            onClick={openAddModal}
            className="bg-cyber-indigo hover:bg-cyber-indigo/90 shadow-lg shadow-cyber-indigo/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
          >`
  );

  fs.writeFileSync(filePath, content);
}

console.log('Add buttons colored with system colors!');
