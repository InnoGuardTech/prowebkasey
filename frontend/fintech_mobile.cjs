const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix Modal overlay wrapper to have no padding on mobile, push to bottom
  content = content.replace(
    /className="fixed inset-0 bg-black\/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4"/g,
    'className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"'
  );

  // Fix Modal inner box to be bottom sheet on mobile (rounded-t-3xl) and have padding at the bottom (safe-area)
  content = content.replace(
    /className="bg-white dark:bg-titanium-900 rounded-t-2xl sm:rounded-xl p-6 (md:p-8 )?w-full max-w-[a-z0-9-]+ shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-\[90vh\]"/g,
    match => match.replace('rounded-t-2xl', 'rounded-t-3xl pb-10 sm:pb-6 sm:rounded-xl')
  );

  content = content.replace(
    /className="bg-white dark:bg-titanium-900 rounded-t-2xl sm:rounded-xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-\[90vh\]"/g,
    'className="bg-white dark:bg-titanium-900 rounded-t-3xl sm:rounded-xl p-6 md:p-8 pb-10 sm:pb-8 w-full max-w-lg shadow-2xl animate-slide-up sm:animate-fade-in overflow-y-auto max-h-[90vh]"'
  );

  // Fix Button rows in Modals to be full width on mobile
  content = content.replace(
    /className="flex gap-3 mt-8"/g,
    'className="flex flex-col sm:flex-row gap-3 mt-8"'
  );

  // Fix table texts on mobile
  content = content.replace(
    /className="text-sm"/g,
    'className="text-xs sm:text-sm"'
  );
  
  // Fix header paddings on mobile (make it tighter)
  content = content.replace(
    /className="p-4 md:p-5/g,
    'className="p-3 md:p-5'
  );
  
  // Update Trips and Advances specific tables
  content = content.replace(
    /className="p-4 font-medium"/g,
    'className="p-3 sm:p-4 font-medium whitespace-nowrap"'
  );
  content = content.replace(
    /className="p-4"/g,
    'className="p-3 sm:p-4 whitespace-nowrap"'
  );

  fs.writeFileSync(filePath, content);
}

// Layout mobile fixes
const layoutPath = path.join(__dirname, 'src', 'components', 'Layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Ensure Sidebar overlay z-index and opacity are proper
layoutContent = layoutContent.replace(
  /className="fixed inset-0 bg-black\/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"/g,
  'className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-opacity"'
);

fs.writeFileSync(layoutPath, layoutContent);

console.log('Mobile UI Polish Applied!');
