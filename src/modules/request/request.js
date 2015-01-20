/* jshint node: true, strict: false */

(function() {

    var request = {};
    // var buildOptions = function(opts, method) {
    //     opts = opts || {};
    //     opts.method = method;
    //     return opts;
    // };

    //var httpVerbs = ['get', 'put', 'post', 'delete', 'head', 'patch'];


    // httpVerbs.forEach(function(verb) {
    //     request[verb] = function(opts, callback) {
    //         var method = String(verb).toUpperCase();
    //         var options = buildOptions(opts, method);
    //         return sender(options, callback);
    //     };
    // });

    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        var http = require('http');

        request.send = function(options) {
            options = options || {};
            var that = this,
                callback = options.succes;

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
        request.send = function(options) {
            options = options || {};

            var xhr = new XMLHttpRequest(),
                url,
                headers = typeof options.headers === 'object' ? options.headers : {},
                callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined;
            //callbackError = options.error && typeof options.error === 'function' ? options.error : undefined;


            try {
                //url = options.hostname + ':' + options.port + options.path;
                url = options.url;
            } catch (Ex) {
                url = undefined;
            }

            var method = String((options.type || 'GET')).toUpperCase();

            if (!url) {
                throw new Error('You must define an url');
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
                    if (callbackSuccess) {
                        callbackSuccess.call(that, xhr.responseText);
                    }
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