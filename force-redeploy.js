const https = require('https');

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
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
      console.log('Triggering new deploy for:', qiyadaService.service.id);
      
      const postData = JSON.stringify({ clearCache: 'clear' });
      const req = https.request({
        hostname: 'api.render.com',
        path: `/v1/services/${qiyadaService.service.id}/deploys`,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (postRes) => {
        let postBody = '';
        postRes.on('data', d => postBody += d);
        postRes.on('end', () => {
          const deploy = JSON.parse(postBody);
          console.log(`Deploy Triggered: ${deploy.id}`);
          
          // Poll for status
          const interval = setInterval(() => {
            https.get({
              hostname: 'api.render.com',
              path: `/v1/services/${qiyadaService.service.id}/deploys/${deploy.id}`,
              headers
            }, (statRes) => {
              let statBody = '';
              statRes.on('data', d => statBody += d);
              statRes.on('end', () => {
                const stat = JSON.parse(statBody);
                console.log(`Status: ${stat.status}`);
                if (stat.status !== 'build_in_progress' && stat.status !== 'update_in_progress' && stat.status !== 'created') {
                  clearInterval(interval);
                  console.log('Finished with status:', stat.status);
                  process.exit(0);
                }
              });
            });
          }, 10000);
        });
      });
      req.write(postData);
      req.end();
    }
  });
});
