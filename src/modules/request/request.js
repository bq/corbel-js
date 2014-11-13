'use strict';
(function() {
    var request = {};

    var sender = function() {};

    var buildOptions = function(opts, method) {
        opts = opts || {};
        opts.method = method;
        return opts;
    };


    request.get = function(opts, callback) {
        var options = buildOptions(opts, 'GET');
        return sender(options, callback);
    };
    request.put = function(opts, callback) {
        var options = buildOptions(opts, 'PUT');
        return sender(options, callback);
    };
    request.post = function(opts, callback) {
        var options = buildOptions(opts, 'POST');
        return sender(options, callback);
    };
    request.delete = function(opts, callback) {
        var options = buildOptions(opts, 'DELETE');
        return sender(options, callback);
    };

    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        var http = require('http');

        sender = function(options, callback) {
            options = options || {};
            var that = this;

            var req = http.request(options, function(res) {
                var str = '';

                res.on('data', function(chunk) {
                    str += chunk;
                });

                res.on('end', function() {
                    if (typeof callback === 'function') {
                        //add notification to event response
                        callback.call(that, str);
                    }
                });

            });

            req.end();

            return req;
        };


        module.exports = request;
    }
    //end--nodejs--

    //browser
    if (typeof window !== 'undefined') {
        sender = function(options, callback) {
            options = options || {};
            var xhr = new XMLHttpRequest();
            var url;
            try {
                url = options.hostname + ':' + options.port + options.path;
            } catch (Ex) {
                url = undefined;
            }
            var method = options.method;

            if (!method || !url) {
                throw new Error('You must define an url and http method');
            }

            xhr.open('GET', url, true);

            var that = this;

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback.call(that, xhr.responseText);
                }
            };

            if (options.data && (options.method === 'POST' || options.method === 'PUT')) {
                xhr.send(options.data);
            } else {
                xhr.send();
            }

            return xhr;


        };

        if (window.silkroad) {
            window.silkroad.request = request;
        } else {
            window.silkroad = {};
            window.silkroad.request = request;
        }
    }
    //end--browser--

})();