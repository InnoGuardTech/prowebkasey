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
          value: 'postgresql://postgres.kbughhqrcixjpqaqrjxu:kayan123456789a@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
        },
        {
          key: 'DB_USERNAME',
          value: 'postgres.kbughhqrcixjpqaqrjxu'
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
          console.log('Fixed DB_USERNAME override! Deploy triggered.');
        });
      });
      req.write(postData);
      req.end();
    }
  });
});
