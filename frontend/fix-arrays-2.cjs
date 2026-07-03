const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const pattern = /\.then\(([^=]+)=>\s*set([a-zA-Z]+)\(\1\.data\s*\|\|\s*\1\)\)/g;
  content = content.replace(pattern, (match, varName, stateName) => {
    changed = true;
    return `.then(${varName} => {
        if (${varName} && ${varName}.data && Array.isArray(${varName}.data)) {
          set${stateName}(${varName}.data);
        } else if (Array.isArray(${varName})) {
          set${stateName}(${varName});
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
console.log('Done 2!');
