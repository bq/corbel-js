    var express = require('express');
    var app = express();
    var router = express.Router();

    app.get('/', function(req, res) {
        var json = require('./res/res.json');
        console.log('request');
        res.send(json);
    });

    app.listen(3000);