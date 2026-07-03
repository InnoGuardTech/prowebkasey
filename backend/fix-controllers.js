const fs = require('fs');
const path = require('path');

const entities = ['trucks', 'drivers', 'trips', 'expenses', 'invoices', 'contractors', 'users'];

for (const entity of entities) {
  const controllerPath = path.join(__dirname, 'src', entity, `${entity}.controller.ts`);

  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Fix bad @Query, @Get()
    content = content.replace(/@Query, @Get\(\)/g, '@Get()');
    content = content.replace(/@Get, @Query,/g, '@Get');
    
    // Ensure Query is imported from @nestjs/common
    if (!content.includes('Query')) {
      content = content.replace("import { Controller,", "import { Controller, Query,");
    }

    fs.writeFileSync(controllerPath, content);
  }
}

console.log('Fixed controllers');
