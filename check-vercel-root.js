const https = require('https');

https.get('https://qiyada.vercel.app/', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(body);
    // Find script tags
    const scripts = body.match(/<script.*?src="(.*?)".*?>/g);
    console.log('Scripts:', scripts);
  });
});
