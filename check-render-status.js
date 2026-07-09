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
    try {
      const services = JSON.parse(body);
      const qiyadaService = services.find(s => s.service.name === 'qiyada-api');
      
      if (qiyadaService) {
        console.log('Service ID:', qiyadaService.service.id);
        console.log('Service Name:', qiyadaService.service.name);
        console.log('URL:', qiyadaService.service.serviceDetails.url);
        
        // Fetch deployments for this service
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
              console.log('Deploy ID:', latestDeploy.id);
              
              if (latestDeploy.status === 'update_failed' || latestDeploy.status === 'build_failed') {
                console.log('Fetching logs...');
                https.get({
                  hostname: 'api.render.com',
                  path: `/v1/services/${qiyadaService.service.id}/deploys/${latestDeploy.id}/logs`,
                  headers
                }, (logRes) => {
                  let logBody = '';
                  logRes.on('data', d => logBody += d);
                  logRes.on('end', () => {
                    const logs = JSON.parse(logBody);
                    console.log('==== DEPLOY LOGS ====');
                    logs.forEach(l => console.log(l.log));
                  });
                });
              }
            }
          });
        });

      } else {
        console.log('Service qiyada-api not found.');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
});
