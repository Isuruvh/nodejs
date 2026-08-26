var express = require('express');
var app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const users = require('./users');

app.use(bodyParser.json());

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get('/userCreated', (request, response) => {
  var returnValue = {
    verification: request.headers['x-okta-verification-challenge'],
  };
  response.json(returnValue);
});

app.post('/userCreated', (request, response) => {
  var newUser = request.body?.data?.events?.[0]?.target?.[0]?.alternateId;
  console.log(' ');

  if (!newUser) {
    console.log('No user in request! Update the JSON target field with a value.');
  } else {
    console.log('The user ' + newUser + ' has been added to the Okta org!');
  }

  response.sendStatus(200);
});

const passwordImportValidation = [
  body('data.context.credential.username', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
  body('data.context.credential.password', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
];

app.post('/passwordImport', passwordImportValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const credentials = req.body.data.context.credential;
  if (users.validate(credentials.username, credentials.password)) {
    console.log('Password verified! Password imported.');
    return res.status(200).json({
      commands: [
        {
          type: 'com.okta.action.update',
          value: {
            credential: 'VERIFIED'
          }
        }
      ]
    });
  }

  console.log('Not verified. Password not imported.');
  return res.status(204).send();
});

var server = app.listen(8082, function () {
  console.log('Node server is running on http://localhost:8082');
});

