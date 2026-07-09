const http = require('http');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log('Logging in as admin...');
  const adminLogin = await request('POST', '/api/v1/auth/login', { email: 'kayansoft1@gmail.com', password: 'password' });
  const adminToken = adminLogin.body.access_token;
  if (!adminToken) { console.error('Admin login failed', adminLogin); return; }
  
  console.log('Creating driver...');
  const newDriver = await request('POST', '/api/v1/users', { 
    full_name: 'Test Driver ' + Date.now(), 
    email: 'driver' + Date.now() + '@test.com', 
    password: 'password123', 
    role: 'driver',
    phone: '123456789'
  }, adminToken);
  
  const driverEmail = newDriver.body.email;
  const driverId = newDriver.body.id;
  console.log('Driver created:', driverId);
  
  console.log('Creating truck...');
  const newTruck = await request('POST', '/api/v1/trucks', { 
    truck_number: 'TRK-' + Date.now(), 
    driver_id: driverId,
    status: 'active'
  }, adminToken);
  console.log('Truck created:', newTruck.body.id);

  console.log('Logging in as driver...');
  const driverLogin = await request('POST', '/api/v1/auth/login', { email: driverEmail, password: 'password123' });
  const driverToken = driverLogin.body.access_token;
  if (!driverToken) { console.error('Driver login failed', driverLogin); return; }

  console.log('Driver getting their trucks...');
  const driverTrucks = await request('GET', '/api/v1/trucks', null, driverToken);
  console.log('Driver trucks:', driverTrucks.body.data.length);

  console.log('Driver adding expense...');
  const expense = await request('POST', '/api/v1/expenses', {
    amount: 150,
    notes: 'Test expense',
    expense_date: '2026-07-03',
    truck_id: newTruck.body.id,
    category_id: null
  }, driverToken);
  console.log('Expense added:', expense.body.id);

  console.log('Driver getting expenses...');
  const driverExpenses = await request('GET', '/api/v1/expenses', null, driverToken);
  console.log('Driver expenses count:', driverExpenses.body.data ? driverExpenses.body.data.length : driverExpenses.body);

  if (driverExpenses.body.data && driverExpenses.body.data.length > 0) {
     console.log('Expense data:', JSON.stringify(driverExpenses.body.data[0], null, 2));
  }
}

run().catch(console.error);
