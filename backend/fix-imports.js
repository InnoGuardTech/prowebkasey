const fs = require('fs');
const path = require('path');

const entities = ['trucks', 'drivers', 'trips', 'expenses', 'invoices', 'contractors', 'users'];

for (const entity of entities) {
  const controllerPath = path.join(__dirname, 'src', entity, `${entity}.controller.ts`);

  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Check if Query is imported
    if (!content.match(/\bQuery\b/)) {
      // Find the @nestjs/common import and inject Query
      content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]@nestjs\/common['"]/, (match, p1) => {
        return `import { ${p1.trim()}, Query } from '@nestjs/common'`;
      });
      fs.writeFileSync(controllerPath, content);
    } else {
       // if it has Query in the file but not in import
       const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]@nestjs\/common['"]/);
       if (importMatch && !importMatch[1].includes('Query')) {
           content = content.replace(importMatch[0], `import { ${importMatch[1].trim()}, Query } from '@nestjs/common'`);
           fs.writeFileSync(controllerPath, content);
       }
    }
  }
}
console.log('Fixed imports');
