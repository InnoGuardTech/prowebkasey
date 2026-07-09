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
        path: `/v1/services/${qiyadaService.service.id}/deploys?limit=1`,
        headers
      }, (depRes) => {
        let depBody = '';
        depRes.on('data', d => depBody += d);
        depRes.on('end', () => {
          const deploys = JSON.parse(depBody);
          if (deploys && deploys.length > 0) {
            const latestDeploy = deploys[0].deploy;
            console.log('Latest Deploy Status:', latestDeploy.status);
            console.log('Finished At:', latestDeploy.finishedAt);
          }
        });
      });
    }
  });
});
