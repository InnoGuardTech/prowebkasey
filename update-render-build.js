const https = require('https');

const data = JSON.stringify({
  serviceDetails: {
    envSpecificDetails: {
      buildCommand: "npm install && echo 'Skipping build, using pre-compiled dist'",
      startCommand: "npm run start:prod"
    }
  }
});

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-d93g407aqgkc73bteee0',
  method: 'PATCH',
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
