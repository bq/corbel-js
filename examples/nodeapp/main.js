(function() {

    var silkroad = require('../../src/main.js');
    var http = require('http');

    silkroad.request.get({
        hostname: 'localhost',
        path: '/',
        port: 3000
    }, function(res) {
        console.log("recieved: ", res);
        process.exit();
    });

})();