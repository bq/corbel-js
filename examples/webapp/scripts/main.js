'use strict';

(function() {

    window.console.log('silkroad: ', window.silkroad);

    window.silkroad.request.get({
        url: 'http://localhost:3000/',
        headers: {
            'pepe': true,
            'jose': true
        }
    }, function(res) {
        var container = window.document.getElementById('responses');
        container.innerHTML = container.innerHTML + 'GET: \n' + '<pre>' + res + '</pre>';
    });

    window.silkroad.request.head({
        url: 'http://localhost:3000/',
        headers: {
            'pepe': true
        }
    }, function(res) {
        var container = window.document.getElementById('responses');
        container.innerHTML = container.innerHTML + 'HEAD: \n' + '<pre>' + res + '</pre>';
    });

    window.silkroad.request.post({
        url: 'http://localhost:3000/',
        headers: {
            'pepe': true
        },
        data: {
            pepe: 'pepe'
        }
    }, function(res) {
        var container = document.getElementById('responses');
        container.innerHTML = container.innerHTML + 'POST: \n' + '<pre>' + res + '</pre>';
    });



})();