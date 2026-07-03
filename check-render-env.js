const https = require('https');

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d93g407aqgkc73bteee0/env-vars',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer rnd_4zc0fIseoCs9Gct630NqqQxF7nEX'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
}).on('error', err => {
  console.error(err);
});
