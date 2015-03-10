(function() {

    //@exclude
    'use strict';
    /*globals corbel,module,require */
    //@endexclude


    /**
     * Request object available for brwoser and node environment
     * @type {Object}
     */
    corbel.request = {};

    var xhrSuccessStatus = {
        // file protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    };

    /**
     * Process the server response to the specified object/array/blob/byteArray/text
     * @param  {Mixed} data                             The server response
     * @param  {String} type='array'|'blob'|'json'      The class of the server response
     * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
     * @return {Mixed}                                  Processed data
     */
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

    };

    /**
     * Serialize the data to be sent to the server
     * @param  {Mixed} data                             The data that would be sent to the server
     * @param  {String} type='array'|'blob'|'json'      The class of the data (array, blob, json)
     * @return {String}                                 Serialized data
     */
    var serializeData = function(data, type) {
        var serializedData = data;

        if (type === 'json' && typeof data === 'object') {
            serializedData = JSON.stringify(data);
        }

        return serializedData;

    };

    /**
     * [processResponse description]
     * @param  {[type]} response        [description]
     * @param  {[type]} resolver        [description]
     * @param  {[type]} callbackSuccess [description]
     * @param  {[type]} callbackError   [description]
     * @return {[type]}                 [description]
     */
    var processResponse = function(response, resolver, callbackSuccess, callbackError) {

        //xhr = xhr.target || xhr || {};
        var statusCode = xhrSuccessStatus[response.status] || response.status,
            statusType = Number(response.status.toString()[0]),
            promiseResponse;

        if (statusType < 3) {
            var data = processResponseData(response.responseType, response.dataType);

            if (callbackSuccess) {
                callbackSuccess.call(this, data, response.status, response.responseObject);
            }

            promiseResponse = {
                data: data,
                status: response.status,
            };

            promiseResponse[response.responseObjectType] = response.responseObject;

            resolver.resolve(promiseResponse);

        } else if (statusType === 4) {

            if (callbackError) {
                callbackError.call(this, response.status, response.responseObject, response.error);
            }

            promiseResponse = {
                error: response.error,
                status: response.status,
            };

            promiseResponse[response.responseObjectType] = response.responseObject;

            resolver.reject(promiseResponse);
        }

    };

    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        var request = require('request');

        corbel.request.send = function(options) {
            options = options || {};

            var method = String((options.type || 'GET')).toUpperCase(),
                url = options.url,
                headers = typeof options.headers === 'object' ? options.headers : {},
                contentType = options.contentType || 'application/json',
                isJSON = contentType === 'application/json; charset=utf-8' ? true : false,
                callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined,
                callbackError = options.error && typeof options.error === 'function' ? options.error : undefined,
                self = this,
                responseType = options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                dataType = options.responseType === 'blob' ? options.type || 'image/jpg' : undefined,
                data = options.data || {};


            if (!url) {
                throw new Error('You must define an url');
            }

            headers['content-type'] = contentType;

            var promise = new Promise(function(resolve, reject) {

                request({
                    method: method,
                    url: url,
                    headers: headers,
                    json: isJSON,
                    body: data
                }, function(error, response, body) { //callback

                    processResponse.call(self, {
                        responseObject: response,
                        dataType: dataType,
                        responseType: response.headers['content-type'],
                        response: body,
                        status: response.statusCode,
                        responseObjectType: 'response',
                        error: error
                    }, {
                        resolve: resolve,
                        reject: reject
                    }, callbackSuccess, callbackError);

                });

            });

            return promise;
        };

        module.exports = corbel.request;
    }

    //browser
    if (typeof window !== 'undefined') {

        corbel.request.send = function(options) {
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
            headers['content-type'] = contentType;

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
                    xhr = xhr.target || xhr; // only for fake sinon response xhr

                    processResponse.call(self, {
                        responseObject: xhr,
                        dataType: xhr.dataType,
                        responseType: xhr.responseType,
                        response: xhr.response || xhr.responseText,
                        status: xhr.status,
                        responseObjectType: 'xhr',
                        error: xhr.error
                    }, {
                        resolve: resolve,
                        reject: reject
                    }, callbackSuccess, callbackError);

                    //delete callbacks
                };

                //response fail ()
                httpReq.onerror = function(xhr) {
                    xhr = xhr.target || xhr; // only for fake sinon response xhr

                    processResponse.call(self, {
                        responseObject: xhr,
                        dataType: xhr.dataType,
                        responseType: xhr.responseType,
                        response: xhr.response || xhr.responseText,
                        status: xhr.status,
                        responseObjectType: 'xhr',
                        error: xhr.error
                    }, {
                        resolve: resolve,
                        reject: reject
                    }, callbackSuccess, callbackError);

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


    return corbel.request;

})();
