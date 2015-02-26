(function(root, factory) {
    'use strict';
    /* globals module, define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['es6-pomise'], function(promise) {
            promise.polyfill();
            return factory(root);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(root);
    } else if (root !== undefined) {
        if (root.ES6Promise !== undefined && typeof root.ES6Promise.polyfill === 'function') {
            root.ES6Promise.polyfill();
        }
        root.Silkroad = factory(root);
    }

})(this, function(root) {
    'use strict';
    /* jshint unused: false */

    var Silkroad = {};


    // Request module
    //
    //
    Silkroad.request = {};
    
    var xhrSuccessStatus = {
        // file protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    };
    
    //  Process the server response to the specified object/array/blob/byteArray/text
    //  args: data: the server response,
    //  type: the class of the server response (array, blob, json),
    //  dataType: is an extra param to form the blob object (if the type is blob)
    var processResponseData = function(data, type, dataType) {
            var parsedData = data;
    
            if (type === 'arraybuffer') {
                parsedData = new Uint8Array(data);
            } else if (type === 'blob') {
                parsedData = new Blob([data], {
                    type: dataType
                });
            }
    
            return parsedData;
    
        },
        //  Serialize the data to be sended to the server
        //  args: the data that would be sended to the server,
        //   type: the class of the data (array, blob, json)
        serializeData = function(data, type) {
            var serializedData = data;
    
            if (type === 'json' && typeof data === 'object') {
                serializedData = JSON.stringify(data);
            }
            return serializedData;
    
        };
    
    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        var http = require('http');
    
        Silkroad.request.send = function(options) {
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
    
        module.exports = Silkroad.request;
    }
    
    //browser
    if (typeof window !== 'undefined') {
    
        Silkroad.request.send = function(options) {
            options = options || {};
    
            var httpReq = new XMLHttpRequest(),
                url = options.url,
                headers = typeof options.headers === 'object' ? options.headers : {},
                contentType = options.contentType || 'application/json',
                callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined,
                callbackError = options.error && typeof options.error === 'function' ? options.error : undefined,
                self = this,
                responseType = options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                dataType = options.responseType === 'blob' ? options.type || 'image/jpg' : undefined;
    
    
            if (!url) {
                throw new Error('You must define an url');
            }
    
            var method = String((options.type || 'GET')).toUpperCase();
    
            // add responseType to the request (blob || arraybuffer || text)
            httpReq.responseType = responseType;
    
            //add content-type header
            headers['Content-type'] = contentType;
    
            httpReq.open(method, url, true);
    
            /* add request headers */
            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    httpReq.setRequestHeader(header, headers[header]);
                }
            }
    
            //  Process the server response to the specified object type
            var promise = new Promise(function(resolve, reject) {
                //response recieved
                httpReq.onload = function(xhr) {
    
                    xhr = xhr.target || xhr || {};
                    var statusCode = xhrSuccessStatus[xhr.status] || xhr.status,
                        statusType = Number(statusCode.toString()[0]);
    
    
                    if (statusType < 3) {
                        var data = processResponseData(httpReq.response, httpReq.responseType, dataType);
    
                        if (callbackSuccess) {
                            callbackSuccess.call(self, data, xhr.status, xhr);
                        }
    
                        resolve(data);
                    } else if (statusType === 4) {
    
                        if (callbackError) {
                            callbackError.call(self, xhr, xhr.status, xhr.error);
                        }
    
                        reject(xhr.responseText);
                    }
    
                    //delete callbacks
                };
    
                //response fail ()
                httpReq.onerror = function(xhr) {
                    if (callbackError) {
                        callbackError.call(self, xhr, xhr.status, xhr.error);
                    }
                    reject(xhr.responseText);
                    //delete callbacks
                };
    
            });
    
            if (options.data) {
                httpReq.send(serializeData(options.data, responseType));
            } else {
                httpReq.send();
            }
    
    
            return promise;
    
    
        };
    
    
    }


    return Silkroad;
});