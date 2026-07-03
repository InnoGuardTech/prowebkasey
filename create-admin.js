const https = require('https');

const data = JSON.stringify({
  full_name: "مدير النظام",
  email: "admin@prokasey.com",
  password: "admin",
  phone: "000000000",
  role: "owner"
});

const options = {
  hostname: 'prokasey-api.onrender.com',
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(body);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
