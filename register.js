// server.js
// where your node app starts

require('dotenv').config();
const express = require("express");
const app = express();
const { body, validationResult } = require('express-validator');
app.use(express.json());

// listen for requests :)
const listener = app.listen(8086, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
const basicAuth = require('express-basic-auth');

const configuredUser = process.env.BASIC_AUTH_USER || process.env.user;
const configuredPassword = process.env.BASIC_AUTH_PASSWORD || process.env.password;

/* HTTP Basic auth middleware for Express.
 * If the env values are not set, the app skips auth so the hook can be tested.
 * Once you are ready to require auth, set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD.
 */
if (configuredUser && configuredPassword) {
  app.use(basicAuth({
    users: { [configuredUser]: configuredPassword },
    unauthorizedResponse: () => 'Unauthorized',
    challenge: true
  }));
}

function myAuthorizer(username, password) {
  if (!username || !password) {
    return false;
  }

  const userMatches = basicAuth.safeCompare(username, configuredUser || '');
  const passwordMatches = basicAuth.safeCompare(password, configuredPassword || '');

  return userMatches && passwordMatches;
}

app.post('/registrationHookSSR', async (request, response) => {
  console.log();
  console.log("Type of Okta registration hook request: " + request.body.requestType); // confirms the type of Okta request
  var returnValue = {};

  if (request.body.requestType === 'self.service.registration') {
    var emailRegistration = (request.body.data.userProfile['login']).split('@');
    if (emailRegistration[1].includes('okta.com')) {
      console.log(request.body.data.userProfile['firstName'] + " " + request.body.data.userProfile['lastName'] + " " + request.body.data.userProfile['email'] + " has registered!");
      returnValue = {
        'commands':[
          {
            type: 'com.okta.action.update',
            value: {
              'registration': 'ALLOW',
            }
          }
        ]
      };
    } else {
      console.log(request.body.data.userProfile['firstName'] + " " + request.body.data.userProfile['lastName'] + " " + request.body.data.userProfile['email'] + " denied registration!");
        returnValue = {
        'commands':[
          {
            type: 'com.okta.action.update',
            value: {
              'registration': 'DENY',
            },
          }
        ],
        'error': {
          'errorSummary':'Incorrect email address. Please contact your admin.',
          'errorCauses':[{
            'errorSummary':'Only okta.com emails can register.',
            'reason':'INVALID_EMAIL_DOMAIN',
            'locationType':'body',
            'location':'data.userProfile.email',
            'domain':'end-user'
          }]
        }
      };
    }
  }

 response.status(200).send(JSON.stringify(returnValue));
})
