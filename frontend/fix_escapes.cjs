const fs = require('fs');
const path = require('path');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The files literally contain: \`Bearer \${token}\`
  // We need them to be: `Bearer ${token}`
  
  content = content.replace(/\\`Bearer \\\$\{token\}\\`/g, '`Bearer ${token}`');
  
  // Fix url interpolations
  content = content.replace(/\\`http:\/\/localhost:3000\/api\/v1\/users\/\\\$\{formData.id\}\\`/g, '`http://localhost:3000/api/v1/users/${formData.id}`');
  content = content.replace(/\\`http:\/\/localhost:3000\/api\/v1\/users\/\\\$\{id\}\\`/g, '`http://localhost:3000/api/v1/users/${id}`');
  content = content.replace(/\\`http:\/\/localhost:3000\/api\/v1\/settings\/backup\?token=\\\$\{token\}\\`/g, '`http://localhost:3000/api/v1/settings/backup?token=${token}`');

  fs.writeFileSync(filePath, content);
};

fixFile(path.join(__dirname, 'src', 'components', 'Layout.tsx'));
fixFile(path.join(__dirname, 'src', 'pages', 'Settings.tsx'));
fixFile(path.join(__dirname, 'src', 'pages', 'Users.tsx'));

console.log('Escapes fixed!');
