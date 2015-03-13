/* jshint node: true, strict: false */

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express();

var timeout = require('connect-timeout');
app.use(timeout(10000));

// app.use(bodyParser.json());

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

        res.send(response);
    });

    app[verb]('request/fail', cors(), function(req, res) {

        var headers = req.headers;
        var body = req.body;

        var response = {
            headers: headers,
            body: body
        };

        res.status(404);
        res.send(response);
    });

});


// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', {
            url: req.url
        });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            error: 'Not found'
        });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
    next();
});


module.exports = app.listen;
module.exports = app.use(function() {});