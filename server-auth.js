var express = require('express');
var app = express();
require('dotenv').config();

var basicAuth = require('express-basic-auth');

app.use(basicAuth({
  users: { [process.env.user]: process.env.password },
  unauthorizedResponse: () => 'Unauthorized',
  challenge: true
}));

app.get('/', function (request, response) {
  response.send('This is the protected auth server for later use.');
});

app.get('/secure', function (request, response) {
  response.send('Secure route protected by Basic Auth.');
});

var server = app.listen(8083, function () {
  console.log('Auth server is running on http://localhost:8083');
});
