const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Expenses.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Inject getRole function inside Expenses component
const roleLogic = `
  const getRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'admin';
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).role;
    } catch(e) {
      return 'admin';
    }
  };
  const userRole = getRole();
`;

// Insert it right after const [error, setError] = useState('');
content = content.replace(
  /const \[error, setError\] = useState\(''\);/,
  `const [error, setError] = useState('');\n${roleLogic}`
);

// Hide approve/reject buttons
content = content.replace(
  /<div className="flex gap-1 mt-1">\n\s*<button onClick=\{\(\) => handleApprove\(expense\.id\)\} className="bg-finance-green text-white px-2 py-1 rounded text-xs hover:bg-green-600">اعتماد<\/button>\n\s*<button onClick=\{\(\) => handleReject\(expense\.id\)\} className="bg-finance-red text-white px-2 py-1 rounded text-xs hover:bg-red-700">رفض<\/button>\n\s*<\/div>/,
  `{userRole !== 'driver' && (
                          <div className="flex gap-1 mt-1">
                            <button onClick={() => handleApprove(expense.id)} className="bg-finance-green text-white px-2 py-1 rounded text-xs hover:bg-green-600">اعتماد</button>
                            <button onClick={() => handleReject(expense.id)} className="bg-finance-red text-white px-2 py-1 rounded text-xs hover:bg-red-700">رفض</button>
                          </div>
                          )}`
);

// Hide edit/delete buttons
content = content.replace(
  /<button onClick=\{\(\) => openEditModal\(expense\)\} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل<\/button>\n\s*<button onClick=\{\(\) => handleDelete\(expense\.id\)\} className="text-finance-red hover:text-red-700 text-sm">حذف<\/button>/,
  `{userRole !== 'driver' ? (
                        <>
                          <button onClick={() => openEditModal(expense)} className="text-blue-500 hover:text-blue-700 ml-3 text-sm">تعديل</button>
                          <button onClick={() => handleDelete(expense.id)} className="text-finance-red hover:text-red-700 text-sm">حذف</button>
                        </>
                      ) : (
                        <span className="text-zinc-400 text-xs">-</span>
                      )}`
);

fs.writeFileSync(filePath, content);
console.log('Expenses UI protected!');
