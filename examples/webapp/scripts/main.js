'use strict';

(function() {

    window.console.log('silkroad: ', window.silkroad);

    window.silkroad.request.send({
        url: 'http://localhost:3000/',
        type: 'GET',
        headers: {
            'X-Custom1': true,
            'X-Custom2': true
        },
        success: function(res) {
            var container = window.document.getElementById('responses');
            container.innerHTML = container.innerHTML + 'GET: \n' + '<pre>' + res + '</pre>';
        }
    });

    window.silkroad.request.send({
        url: 'http://localhost:3000/',
        type: 'HEAD',
        headers: {
            'X-Custom1': true,
            'X-Custom2': true
        },
        success: function(res) {
            var container = window.document.getElementById('responses');
            container.innerHTML = container.innerHTML + 'HEAD: \n' + '<pre>' + res + '</pre>';
        }
    });

    window.silkroad.request.send({
        url: 'http://localhost:3000/',
        type: 'POST',
        headers: {
            'X-Custom1': true,
            'X-Custom2': true
        },
        data: {
            example: 'pepe'
        },
        success: function(res) {
            var container = document.getElementById('responses');
            container.innerHTML = container.innerHTML + 'POST: \n' + '<pre>' + res + '</pre>';
        }
    });



})();