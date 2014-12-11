/* jshint node: true, strict: false */

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.options('*', cors());

var HTTP_VERBS = ['get', 'put', 'post', 'delete', 'head', 'patch'];

var CUSTOM_HEADERS = ['pepe', 'jose'];

var buildResponse = function(headers, body) {
    var RESPONSE = '' +
        '-----Headers-----: \n' +
        JSON.stringify(headers, null, '  ') +
        '\n' +
        '-----Body-----: \n' +
        JSON.stringify(body, null, '  ') +
        '\n';

    return RESPONSE;
};

var getCustomHeaders = function(headers) {
    var result = [];

    CUSTOM_HEADERS.forEach(function(header) {
        if (headers.header) {
            result.push(header);
        }
    });
    return result;
};

var addResponseCustomsHeaders = function(customHeaders) {
    var string = '';
    customHeaders.forEach(function(header, index) {
        header = String(header);
        index > 0 ? string += ',' + header : string += header;
    });
    return string;
};

HTTP_VERBS.forEach(function(verb) {
    app[verb]('/', cors(), function(req, res) {
        var headers = req.headers;
        var body = req.body;
        var customHeaders = getCustomHeaders(headers);



        var resp = buildResponse(headers, body);

        res.send(resp);
    });
});


module.exports = app.listen;
module.exports = app.use(function() {});