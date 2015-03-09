'use strict';
var corbel = require('../../dist/corbel.js');

corbel.request.send({
    url: 'http://localhost:3000',
    method: 'GET'
}, function() {
    console.log('recieved: ', arguments);
});