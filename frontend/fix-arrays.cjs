const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Pattern: .then(data => setSomething(data.data || data))
  const pattern1 = /\.then\(data\s*=>\s*set([a-zA-Z]+)\(data\.data\s*\|\|\s*data\)\)/g;
  content = content.replace(pattern1, (match, stateName) => {
    changed = true;
    return `.then(data => {
        if (data && data.data && Array.isArray(data.data)) {
          set${stateName}(data.data);
        } else if (Array.isArray(data)) {
          set${stateName}(data);
        } else {
          set${stateName}([]);
        }
      })`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${path.basename(filePath)}`);
  }
};

fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    fixFile(path.join(pagesDir, file));
  }
});
console.log('Done!');
