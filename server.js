var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

//Basic Auth
var basicAuth = require('express-basic-auth');
app.use(basicAuth({
users: { 'admin': 'supersecret' },
unauthorizedResponse: req => 'Unauthorized'
}));


// Event hook initial verification
// Extract header 'x-okta-verification-challenge' from Okta request
// Return value as JSON object verification
app.get("/userCreated", (request, response) => {
    var returnValue = {
    "verification": request.headers['x-okta-verification-challenge'],
    };
    response.json(returnValue);
});

//userCreated Event request, POST from Okta

app.post("/userCreated", (request, response) => {

    var newUser = request.body.data.events[0].target[0]["alternateId"];
    console.log(" ");
    if (newUser == null){
        console.log('No user in request! Update the JSON target field with a value.');
    } else {
        console.log('The user ' + newUser +
        ' has been added to the Okta org!');
    }
    response.sendStatus(200);
   }
);

var server = app.listen(8082, function () {
    console.log('Node server is running on http://localhost:8082');
});
