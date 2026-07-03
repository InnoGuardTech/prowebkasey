const https = require('https');

const data = JSON.stringify([
  { key: 'DB_TYPE', value: 'postgres' },
  { key: 'DB_URL', value: 'postgresql://postgres:kayan123456789a@db.kbughhqrcixjpqaqrjxu.supabase.co:5432/postgres' },
  { key: 'JWT_SECRET', value: 'super_secret_jwt_key_prokasey' }
]);

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d93g407aqgkc73bteee0/env-vars',
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer rnd_4zc0fIseoCs9Gct630NqqQxF7nEX'
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
  console.error(error);
});

req.write(data);
req.end();
