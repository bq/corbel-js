(function() {

    console.log('silkroad: ', window.silkroad);

    silkroad.request.get({
        port: '3000',
        hostname: 'localhost',
        path: '/res/res.json'
    }, function(res) {
        console.log(res);
    });



})();