const https = require('https');

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer rnd_4zc0fIseoCs9Gct630NqqQxF7nEX'
};

https.get({
  hostname: 'api.render.com',
  path: '/v1/owners',
  headers
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const owners = JSON.parse(body);
    const ownerId = owners[0].owner.id;
    console.log(`Using ownerId: ${ownerId}`);

    const data = JSON.stringify({
      type: 'web_service',
      name: 'prokasey-api',
      ownerId: ownerId,
      repo: 'https://github.com/InnoGuardTech/prowebkasey',
      branch: 'main',
      autoDeploy: 'yes',
      rootDir: 'backend',
      serviceDetails: {
        env: 'node',
        envSpecificDetails: {
          buildCommand: 'npm install && npm run build',
          startCommand: 'npm run start:prod'
        },
        envVars: [
          { key: 'DB_TYPE', value: 'postgres' },
          { key: 'DB_URL', value: 'postgresql://postgres:kayan123456789a@db.kbughhqrcixjpqaqrjxu.supabase.co:5432/postgres' },
          { key: 'JWT_SECRET', value: 'super_secret_jwt_key_prokasey' }
        ],
        plan: 'free',
        region: 'frankfurt'
      }
    });

    const req = https.request({
      hostname: 'api.render.com',
      path: '/v1/services',
      method: 'POST',
      headers
    }, (postRes) => {
      let postBody = '';
      postRes.on('data', d => postBody += d);
      postRes.on('end', () => {
        console.log(`Status Code: ${postRes.statusCode}`);
        console.log(postBody);
      });
    });

    req.write(data);
    req.end();
  });
});
