/* jshint node: true, strict: false */

(function() {
    var request = {};

    var sender = function() {};

    var buildOptions = function(opts, method) {
        opts = opts || {};
        opts.method = method;
        return opts;
    };

    var httpVerbs = ['get', 'put', 'post', 'delete', 'head', 'patch'];


    httpVerbs.forEach(function(verb) {
        request[verb] = function(opts, callback) {
            var method = String(verb).toUpperCase();
            var options = buildOptions(opts, method);
            return sender(options, callback);
        };
    });

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

            var url,
                headers = typeof options.headers === 'object' ? options.headers : {};

            try {
                //url = options.hostname + ':' + options.port + options.path;
                url = options.url;
            } catch (Ex) {
                url = undefined;
            }
            var method = options.method;

            if (!method || !url) {
                throw new Error('You must define an url and http method');
            }

            xhr.open(method, url, true);

            /* add request headers */
            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }

            var that = this;

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback.call(that, xhr.responseText);
                }
            };

            if (options.data) {
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