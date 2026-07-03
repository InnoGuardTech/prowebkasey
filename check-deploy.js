const https = require('https');

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d93g407aqgkc73bteee0/deploys?limit=1',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer rnd_4zc0fIseoCs9Gct630NqqQxF7nEX'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
