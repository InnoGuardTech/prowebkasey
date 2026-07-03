const https = require('https');

const data = JSON.stringify({
  invoice_number: "6521",
  description: "نقل",
  amount: 1498,
  invoice_date: "2026-07-03",
  status: "pending"
});

const loginData = JSON.stringify({
  email: "admin@prokasey.com",
  password: "Admin@123"
});

// Login first
const loginReq = https.request({
  hostname: 'prokasey-api.onrender.com',
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const token = JSON.parse(body).access_token;
    
    // Create Invoice
    const invReq = https.request({
      hostname: 'prokasey-api.onrender.com',
      path: '/api/v1/invoices',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, (invRes) => {
      let invBody = '';
      invRes.on('data', d => invBody += d);
      invRes.on('end', () => {
        console.log(`Invoice Creation Status: ${invRes.statusCode}`);
        console.log(invBody);
      });
    });
    invReq.write(data);
    invReq.end();
  });
});

loginReq.write(loginData);
loginReq.end();
