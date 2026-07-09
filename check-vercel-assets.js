const https = require('https');

https.get('https://qiyada.vercel.app/assets/index.js', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('Body snippet:', body.substring(0, 100));
  });
});
