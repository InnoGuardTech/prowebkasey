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
        path: `/v1/services/${qiyadaService.service.id}/deploys?limit=5`,
        headers
      }, (depRes) => {
        let depBody = '';
        depRes.on('data', d => depBody += d);
        depRes.on('end', () => {
          const deploys = JSON.parse(depBody);
          console.log("Recent Deploys:");
          deploys.forEach(d => {
            console.log(`- ID: ${d.deploy.id}, Status: ${d.deploy.status}, CreatedAt: ${d.deploy.createdAt}`);
          });
        });
      });
    }
  });
});
