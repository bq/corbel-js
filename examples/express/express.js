/* jshint node: true, strict: false */

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.options('*', cors());

var HTTP_VERBS = ['get', 'put', 'post', 'delete', 'head', 'patch'];

// var CUSTOM_HEADERS = ['X-Custom1', 'X-Custom2'];
// var buildResponse = function(headers, body) {


//////////////////////////
//     return response; //
// };                   //
//                      //
//////////////////////////

HTTP_VERBS.forEach(function(verb) {
    app[verb]('/', cors(), function(req, res) {
        var headers = req.headers;
        var body = req.body;

        var response = {
            headers: headers,
            body: body
        };

        console.log('response: ', response);
        console.log('instanceof blob: ', response.body instanceof Blob);

        res.send(JSON.stringify(response, null, 3));
    });
});


module.exports = app.listen;
module.exports = app.use(function() {});