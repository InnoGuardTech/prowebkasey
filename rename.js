const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    // Replace Arabic Names
    .replace(/نظام إدارة القواطر/g, 'نظام قيادة')
    .replace(/نظام القواطر/g, 'نظام قيادة')
    .replace(/برو كاسي/g, 'قيادة')
    
    // Replace English Names
    .replace(/ProKasey/g, 'Qiyada')
    .replace(/Prokasey/g, 'Qiyada')
    .replace(/prokasey/g, 'qiyada');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist') && !fullPath.includes('.tempmediaStorage')) {
        walkDir(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (['.ts', '.tsx', '.html', '.md', '.json', '.yml', '.js', '.mjs', '.cjs'].includes(ext)) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir('./frontend');
walkDir('./backend');
replaceInFile('./README.md');
replaceInFile('./DEPLOYMENT_GUIDE.md');
replaceInFile('./System_Credentials.md');
replaceInFile('./docker-compose.yml');
