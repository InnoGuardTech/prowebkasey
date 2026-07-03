// test_apis.mjs - Full API test script
const BASE = 'http://localhost:3000';

async function post(url, body) {
  const res = await fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function get(url, token) {
  const res = await fetch(BASE + url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  console.log('=== 1. LOGIN TEST ===');
  const login = await post('/api/v1/auth/login', {
    email: 'admin@prokasey.com',
    password: 'Admin@123',
  });
  console.log('Login status:', login.status);
  if (login.status !== 201 && login.status !== 200) {
    console.log('Login FAILED:', JSON.stringify(login.data));
    return;
  }
  const token = login.data.access_token;
  console.log('Token:', token ? token.substring(0, 30) + '...' : 'NONE');
  console.log('User:', JSON.stringify(login.data.user));

  console.log('\n=== 2. DASHBOARD TEST ===');
  const dash = await get('/api/v1/dashboard', token);
  console.log('Dashboard status:', dash.status, JSON.stringify(dash.data));

  console.log('\n=== 3. TRUCKS TEST ===');
  const trucks = await get('/api/v1/trucks', token);
  console.log('Trucks status:', trucks.status, 'count:', Array.isArray(trucks.data) ? trucks.data.length : 'N/A');

  console.log('\n=== 4. INVOICES TEST ===');
  const invoices = await get('/api/v1/invoices', token);
  console.log('Invoices status:', invoices.status, 'count:', Array.isArray(invoices.data) ? invoices.data.length : 'N/A');

  console.log('\n=== 5. EXPENSES TEST ===');
  const expenses = await get('/api/v1/expenses', token);
  console.log('Expenses status:', expenses.status, 'count:', Array.isArray(expenses.data) ? expenses.data.length : 'N/A');

  console.log('\n=== 6. AUDIT LOGS TEST ===');
  const audit = await get('/api/v1/audit-logs', token);
  console.log('Audit status:', audit.status, 'count:', Array.isArray(audit.data) ? audit.data.length : 'N/A');

  console.log('\n=== 7. SEARCH TEST ===');
  const search = await get('/api/v1/search?q=test', token);
  console.log('Search status:', search.status, JSON.stringify(search.data));

  console.log('\n=== 8. DRIVERS TEST ===');
  const drivers = await get('/api/v1/drivers', token);
  console.log('Drivers status:', drivers.status, 'count:', Array.isArray(drivers.data) ? drivers.data.length : 'N/A');

  console.log('\n=== 9. CONTRACTORS TEST ===');
  const contractors = await get('/api/v1/contractors', token);
  console.log('Contractors status:', contractors.status, 'count:', Array.isArray(contractors.data) ? contractors.data.length : 'N/A');

  console.log('\n=== 10. EXPENSE CATEGORIES TEST ===');
  const cats = await get('/api/v1/expenses/categories', token);
  console.log('Categories status:', cats.status, 'count:', Array.isArray(cats.data) ? cats.data.length : 'N/A');

  console.log('\n=== FRONTEND PROXY TEST ===');
  try {
    const proxyRes = await fetch('http://localhost:5173/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@prokasey.com', password: 'Admin@123' }),
    });
    const proxyData = await proxyRes.json();
    console.log('Proxy login status:', proxyRes.status, proxyData.access_token ? 'TOKEN_OK' : 'NO_TOKEN');
  } catch (e) {
    console.log('Proxy FAILED:', e.message);
  }

  console.log('\n=== ALL TESTS COMPLETE ===');
}

main().catch(e => console.error('Fatal:', e.message));
