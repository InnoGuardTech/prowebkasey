const https = require('https');

const newDbUrl = 'postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan1223456789a@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const data = JSON.stringify([
  { "key": "DB_URL", "value": "postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan123456789a@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres" },
  { "key": "DB_HOST", "value": "aws-0-ap-northeast-1.pooler.supabase.com" },
  { "key": "DB_PORT", "value": "5432" },
  { "key": "DB_USERNAME", "value": "postgres.kbughhqrcixjpqaqrjxu" },
  { "key": "DB_PASSWORD", "value": "kayan123456789a" },
  { "key": "DB_DATABASE", "value": "postgres" },
  { "key": "JWT_SECRET", "value": "super_secret_jwt_key_prokasey" },
  { "key": "DB_TYPE", "value": "postgres" }
]);

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d93g407aqgkc73bteee0/env-vars',
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer rnd_4zc0fIseoCs9Gct630NqqQxF7nEX',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let resData = '';
  res.on('data', chunk => resData += chunk);
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response:", resData);
  });
});

req.on('error', (e) => {
  console.error("Error:", e.message);
});

req.write(data);
req.end();
