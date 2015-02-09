(function() {

    var silkroad = require('../../dist/silkroad.js');
    var http = require('http');

    silkroad.request.get({
        hostname: 'localhost',
        path: '/',
        port: 3000
    }, function(res) {
        //console.log("recieved: ", res);
        process.exit();
    });

})();