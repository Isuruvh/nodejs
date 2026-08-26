require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.post('/registrationHookPP', async (request, response) => {
  const body = request.body || {};
  const requestType = body.requestType;
  const userProfileUpdate = (body.data && body.data.userProfileUpdate) || {};
  const userProfile = (body.data && body.data.context && body.data.context.user && body.data.context.user.profile) || {};

  console.log();
  console.log('Type of Okta progressive profile request: ' + requestType);

  if (requestType !== 'progressive.profile') {
    return response.status(200).json({ commands: [] });
  }

  const employeeNumberValue = userProfileUpdate.employeeNumber;
  const employeeNumber = typeof employeeNumberValue === 'number'
    ? String(employeeNumberValue)
    : (typeof employeeNumberValue === 'string' ? employeeNumberValue.trim() : '');

  const isValidEmployeeNumber = /^\d{4}$/.test(employeeNumber);

  if (isValidEmployeeNumber) {
    console.log(`${userProfile.firstName || ''} ${userProfile.lastName || ''} ${userProfile.login || ''} has updated profile!`);

    return response.status(200).json({
      commands: [
        {
          type: 'com.okta.user.progressive.profile.update',
          value: {
            employeeNumber: employeeNumber,
            mobilePhone: userProfileUpdate.mobilePhone || userProfile.mobilePhone || ''
          }
        }
      ]
    });
  }

  console.log(`${userProfile.firstName || ''} ${userProfile.lastName || ''} ${userProfile.login || ''} employee number is not the correct number of digits!`);

  return response.status(200).json({
    commands: [],
    error: {
      errorSummary: 'Incorrect employee number. Enter an employee number with 4 digits.',
      errorCauses: [
        {
          errorSummary: 'Employee numbers must have 4 digits.',
          reason: 'INVALID_EMPLOYEE_NUMBER',
          locationType: 'body',
          location: 'data.userProfileUpdate.employeeNumber',
          domain: 'end-user'
        }
      ]
    }
  });
});

const PORT = process.env.PORT || 8087;
app.listen(PORT, function () {
  console.log('Progressive profile hook server is running on http://localhost:' + PORT);
});
