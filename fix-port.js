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
      const newEnvVars = [
        { key: 'DB_TYPE', value: 'postgres' },
        { key: 'JWT_SECRET', value: 'super_secret_jwt_key_qiyada' },
        {
          key: 'DB_URL',
          value: 'postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan123456789a@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
        }
      ];

      const postData = JSON.stringify(newEnvVars);
      
      const req = https.request({
        hostname: 'api.render.com',
        path: `/v1/services/${qiyadaService.service.id}/env-vars`,
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (postRes) => {
        let postBody = '';
        postRes.on('data', d => postBody += d);
        postRes.on('end', () => {
          console.log(`Update Env Status: ${postRes.statusCode}`);
          console.log('Fixed DB_URL port back to 5432. Deploy triggered.');
          
          // Poll for completion
          setTimeout(() => {
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
                  const deploy = deploys[0].deploy;
                  console.log(`Deploy Triggered: ${deploy.id}`);
                  
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
                        }
                      });
                    });
                  }, 10000);
                }
              });
            });
          }, 3000); // Wait 3s before getting deploy ID
        });
      });
      req.write(postData);
      req.end();
    }
  });
});
