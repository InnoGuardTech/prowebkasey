const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'Trucks', endpoint: 'trucks', stateName: 'trucks', setter: 'setTrucks' },
  { name: 'Drivers', endpoint: 'users', stateName: 'drivers', setter: 'setDrivers' }, // Wait, Drivers fetches all users? No, drivers is returned by /api/v1/drivers. Let's look at the file.
  { name: 'Trips', endpoint: 'trips', stateName: 'trips', setter: 'setTrips' },
  { name: 'Expenses', endpoint: 'expenses', stateName: 'expenses', setter: 'setExpenses' },
  { name: 'Invoices', endpoint: 'invoices', stateName: 'invoices', setter: 'setInvoices' },
];

for (const entity of entities) {
  const filePath = path.join(__dirname, 'src', 'pages', `${entity.name}.tsx`);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import
    if (!content.includes('import Pagination')) {
      content = content.replace("import { useState", "import Pagination from '../components/Pagination';\nimport { useState");
    }
    
    // Add states
    if (!content.includes('setTotalPages')) {
      content = content.replace(
        /const \[loading, setLoading\] = useState\(true\);/,
        `const [loading, setLoading] = useState(true);\n  const [page, setPage] = useState(1);\n  const [totalPages, setTotalPages] = useState(1);`
      );
    }
    
    // Update fetch endpoint
    if (entity.name === 'Drivers') {
      content = content.replace(/fetch\('\/api\/v1\/drivers'/g, "fetch(`/api/v1/drivers?page=${page}`");
    } else {
      content = content.replace(new RegExp(`fetch\\('\\/api\\/v1\\/${entity.endpoint}'`, 'g'), `fetch(\`/api/v1/${entity.endpoint}?page=\${page}\``);
    }
    
    // Add useEffect dependency
    if (entity.name === 'Drivers') {
       content = content.replace(/useEffect\(\(\) => \{\n    fetchDrivers\(\);\n  \}, \[\]\);/, `useEffect(() => {\n    fetchDrivers();\n  }, [page]);`);
    } else {
       content = content.replace(new RegExp(`useEffect\\(\\(\\) => \\{\\n    fetch${entity.name}\\(\\);\\n  \\}, \\[\\]\\);`), `useEffect(() => {\n    fetch${entity.name}();\n  }, [page]);`);
    }
    
    // Handle response parsing
    const resParsing = `if (data.data) {
          ${entity.setter}(data.data);
          setTotalPages(data.lastPage || 1);
        } else {
          ${entity.setter}(data);
        }`;
        
    if (content.includes(`${entity.setter}(data);`)) {
       content = content.replace(`${entity.setter}(data);`, resParsing);
    }

    // Insert Pagination component after the table
    if (!content.includes('<Pagination')) {
      content = content.replace(/<\/table>\n\s*<\/div>/, `</table>\n            </div>\n            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />`);
    }

    fs.writeFileSync(filePath, content);
  }
}

console.log('Frontend refactored');
