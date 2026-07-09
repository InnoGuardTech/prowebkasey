const https = require('https');

const headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer rnd_MXY6SFq8eBEXRNkAxP1DVD6NoOLw'
};

https.get({
  hostname: 'api.render.com',
  path: '/v1/services',
  headers
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const services = JSON.parse(body);
    const qiyadaService = services.find(s => s.service.name === 'qiyada-api');
    
    if (qiyadaService) {
      https.get({
        hostname: 'api.render.com',
        path: `/v1/services/${qiyadaService.service.id}/env-vars`,
        headers
      }, (envRes) => {
        let envBody = '';
        envRes.on('data', d => envBody += d);
        envRes.on('end', () => {
          console.log(envBody);
        });
      });
    }
  });
});
