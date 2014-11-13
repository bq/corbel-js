    var express = require('express');
    var app = express();
    var router = express.Router();

    app.get('/', function(req, res) {
        var json = require('./res/res.json');
        console.log('request');
        res.send(json);
    });

    module.exports = app.listen;
    module.exports = app.use(function(req, res, next) {});