console.log('eoo');

var silkroad = require('../../dist/silkroad.js');

silkroad.request.send({
    url: 'http://localhost:3000',
    method: 'GET'
}, function() {
    console.log("recieved: ", arguments);
});