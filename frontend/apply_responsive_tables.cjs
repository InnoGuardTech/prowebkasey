const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const updates = [
  { file: 'Expenses.tsx', classToAdd: 'responsive-table expenses-table' },
  { file: 'Trips.tsx', classToAdd: 'responsive-table trips-table' },
  { file: 'DriverAdvances.tsx', classToAdd: 'responsive-table advances-table' }
];

for (const update of updates) {
  const filePath = path.join(pagesDir, update.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <table className="w-full text-right border-collapse"> 
  // or whatever it is, with the new class
  content = content.replace(
    /<table className="w-full text-right border-collapse">/g,
    `<table className="w-full text-right border-collapse ${update.classToAdd}">`
  );
  
  // Just in case it already has some other classes
  if (!content.includes(update.classToAdd)) {
     content = content.replace(
       /<table className="([^"]+)">/g,
       (match, p1) => {
         if (!p1.includes('responsive-table')) {
           return `<table className="${p1} ${update.classToAdd}">`;
         }
         return match;
       }
     );
  }

  // Also remove w-full min-w-max from the wrapper div if it exists because that breaks block display width
  content = content.replace(/className="w-full min-w-max px-4 md:px-0"/g, 'className="w-full px-4 md:px-0"');
  
  fs.writeFileSync(filePath, content);
}

console.log('Responsive table classes applied!');
