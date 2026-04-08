const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/exercises/image/0022',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  if (res.statusCode === 200 && res.headers['content-type'] === 'image/gif') {
    console.log('SUCCESS: Proxy returned a GIF!');
  } else {
    console.log('FAILURE: Proxy did not return a valid GIF.');
  }
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
