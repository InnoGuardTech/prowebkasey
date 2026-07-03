const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it has exportToExcel
  if (content.includes('exportToExcel') && !content.includes('exportToPDF')) {
    // Add exportToPDF to imports
    content = content.replace(
      /import \{ exportToExcel, printTable \} from '\.\.\/utils\/exportUtils';/,
      "import { exportToExcel, printTable, exportToPDF } from '../utils/exportUtils';"
    );
    // If it only has exportToExcel
    content = content.replace(
      /import \{ exportToExcel \} from '\.\.\/utils\/exportUtils';/,
      "import { exportToExcel, exportToPDF } from '../utils/exportUtils';"
    );

    // Add button next to Export to Excel
    const excelBtnRegex = /<button\s+onClick=\{\(\) => exportToExcel\([^)]+\)\}\s+className="bg-finance-green[^>]+>\s*(<span[^>]+>.*<\/span>)?\s*تصدير Excel\s*<\/button>/g;
    
    content = content.replace(excelBtnRegex, (match) => {
      // Create PDF button
      const pdfBtn = match
        .replace('exportToExcel', "() => exportToPDF('table-container', 'Report', 'التقرير')")
        .replace('bg-finance-green', 'bg-red-500 hover:bg-red-600')
        .replace('تصدير Excel', 'تصدير PDF')
        .replace('text-white', 'text-white shadow-lg shadow-red-500/30 ml-2');
      
      return match + "\\n            " + pdfBtn;
    });
    
    // Make sure the table container has id="table-container"
    if (!content.includes('id="table-container"')) {
      content = content.replace(/<div className="overflow-x-auto/g, '<div id="table-container" className="overflow-x-auto');
    }

    fs.writeFileSync(filePath, content);
  }
}

console.log('PDF Export buttons added!');
