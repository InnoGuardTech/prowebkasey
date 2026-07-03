const https = require('https');

https.get('https://prowebkasey.vercel.app/trucks', (res) => {
  console.log(`Status Code for /trucks: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(`Body starts with:`, body.substring(0, 100));
  });
}).on('error', (e) => {
  console.error(e);
});
