
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
app.use(express.json());

app.post('/registrationHookSSRandPP', async (request, response) => {
  console.log();
  console.log("Type of Okta registration hook request: " + request.body.requestType); // confirms the type of Okta request
  var returnValue = {};

  if (request.body.requestType === 'progressive.profile') {
    console.log('Employee number added to profile ' + request.body.data.context.user.profile['login'] + ': ' + request.body.data.userProfileUpdate['employeeNumber']);
    var employeeNumber = request.body.data.userProfileUpdate['employeeNumber'];
    if (employeeNumber && employeeNumber.length === 4) {
      returnValue = {
        'commands':[
          {
            type: 'com.okta.user.progressive.profile.update',
            value: {
              'employeeNumber': employeeNumber,
            }
          }
        ]
      };
    } else {
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
          'errorSummary':'Incorrect employee number. Enter an employee number with 4 digits.',
          'errorCauses':[{
            'errorSummary':'Only employee numbers with 4 digits can register.',
            'reason':'INVALID_EMPLOYEE_NUMBER',
            'locationType':'body',
            'location':'data.userProfile.employeeNumber',
            'domain':'end-user'
          }]
        }
      };
    }
  } else {
    var emailRegistration = (request.body.data.userProfile['email']).split('@');
    var employeeNumberSSR = (request.body.data.userProfile['employeeNumber']);
    if (emailRegistration[1].includes('okta.com') && (employeeNumberSSR && employeeNumberSSR.length === 4)){
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
          'errorSummary':'Incorrect email address or employee number. Please contact your admin.',
          'errorCauses':[{
            'errorSummary':'To register, you must have an "okta" email and a 4-digit employee number.',
            'reason':'INVALID_EMAIL_DOMAIN',
            'locationType':'body',
            'location':'data.userProfile.email',
            'domain':'end-user'
          }]
        }
      };
    }
  }

  response.send(JSON.stringify(returnValue));
})
