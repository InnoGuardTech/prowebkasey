const fs = require('fs');
const path = require('path');

const entities = ['trucks', 'drivers', 'trips', 'expenses', 'invoices', 'contractors', 'users'];

for (const entity of entities) {
  const servicePath = path.join(__dirname, 'src', entity, `${entity}.service.ts`);
  const controllerPath = path.join(__dirname, 'src', entity, `${entity}.controller.ts`);

  if (fs.existsSync(servicePath)) {
    let content = fs.readFileSync(servicePath, 'utf8');
    
    // Replace findAll signature and return types depending on entity
    if (content.includes('findAll(userRole?: string, userId?: string)')) {
      content = content.replace(
        'async findAll(userRole?: string, userId?: string) {',
        'async findAll(userRole?: string, userId?: string, page: number = 1, limit: number = 20) {'
      );
      content = content.replace(
        'return query.getMany();',
        'const total = await query.getCount();\n    const data = await query.skip((page - 1) * limit).take(limit).getMany();\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
      );
    } else if (content.includes('findAll(userRole: string, userId: string)')) {
      content = content.replace(
        'async findAll(userRole: string, userId: string) {',
        'async findAll(userRole: string, userId: string, page: number = 1, limit: number = 20) {'
      );
      content = content.replace(
        'return query.getMany();',
        'const total = await query.getCount();\n    const data = await query.skip((page - 1) * limit).take(limit).getMany();\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
      );
    } else if (content.includes('findAll(): Promise<')) {
      content = content.replace(
        /findAll\(\): Promise<([a-zA-Z]+)\[\]> \{/,
        'async findAll(page: number = 1, limit: number = 20): Promise<{ data: $1[], total: number, page: number, lastPage: number }> {'
      );
      content = content.replace(
        /return this\.([a-zA-Z]+)\.find\(\{([\s\S]*?)\}\);/,
        'const [data, total] = await this.$1.findAndCount({$2, skip: (page - 1) * limit, take: limit });\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
      );
      content = content.replace(
        /return this\.([a-zA-Z]+)\.find\(\);/,
        'const [data, total] = await this.$1.findAndCount({ skip: (page - 1) * limit, take: limit });\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
      );
    } else if (content.includes('findAll() {') && !content.includes('page: number')) {
       content = content.replace(
        'async findAll() {',
        'async findAll(page: number = 1, limit: number = 20) {'
      );
      if (content.includes('find({')) {
        content = content.replace(
          /return this\.([a-zA-Z]+)\.find\(\{([\s\S]*?)\}\);/,
          'const [data, total] = await this.$1.findAndCount({$2, skip: (page - 1) * limit, take: limit });\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
        );
      } else {
        content = content.replace(
          /return this\.([a-zA-Z]+)\.find\(\);/,
          'const [data, total] = await this.$1.findAndCount({ skip: (page - 1) * limit, take: limit });\n    return { data, total, page, lastPage: Math.ceil(total / limit) };'
        );
      }
    }
    
    fs.writeFileSync(servicePath, content);
  }

  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');
    
    // Add Query import if missing
    if (!content.includes('Query')) {
      content = content.replace('@Get,', '@Get, @Query,');
      content = content.replace('@Get(', '@Query, @Get(');
    }
    
    if (content.includes('findAll(@Request() req: any)')) {
      content = content.replace(
        'findAll(@Request() req: any) {',
        'findAll(@Request() req: any, @Query(\'page\') page: string = \'1\', @Query(\'limit\') limit: string = \'20\') {'
      );
      content = content.replace(
        'return this.expensesService.findAll(req.user?.role, req.user?.userId);',
        'return this.expensesService.findAll(req.user?.role, req.user?.userId, Number(page), Number(limit));'
      );
    } else if (content.includes('findAll(@Request() req)')) {
      content = content.replace(
        'findAll(@Request() req) {',
        'findAll(@Request() req, @Query(\'page\') page: string = \'1\', @Query(\'limit\') limit: string = \'20\') {'
      );
      content = content.replace(
        'findAll(req.user?.role, req.user?.userId)',
        'findAll(req.user?.role, req.user?.userId, Number(page), Number(limit))'
      );
      content = content.replace(
        'findAll(req.user.role, req.user.userId)',
        'findAll(req.user.role, req.user.userId, Number(page), Number(limit))'
      );
    } else if (content.includes('findAll() {') && !content.includes('page: string')) {
      content = content.replace(
        'findAll() {',
        'findAll(@Query(\'page\') page: string = \'1\', @Query(\'limit\') limit: string = \'20\') {'
      );
      content = content.replace(
        /return this\.([a-zA-Z]+)\.findAll\(\);/,
        'return this.$1.findAll(Number(page), Number(limit));'
      );
    }

    fs.writeFileSync(controllerPath, content);
  }
}

console.log('Pagination refactoring applied.');
