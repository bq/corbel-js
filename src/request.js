//@exclude
'use strict';
/*globals corbel */
//@endexclude

(function() {



    /**
     * Request object available for brwoser and node environment
     * @type {Object}
     */
    var request = corbel.request = {
        /**
         * method constants
         * @namespace
         */
        method: {

            /**
             * GET constant
             * @constant
             * @type {String}
             * @default
             */
            GET: 'GET',
            /**
             * @constant
             * @type {String}
             * @default
             */
            POST: 'POST',
            /**
             * @constant
             * @type {String}
             * @default
             */
            PUT: 'PUT',
            /**
             * @constant
             * @type {String}
             * @default
             */
            DELETE: 'DELETE',
            /**
             * @constant
             * @type {String}
             * @default
             */
            OPTIONS: 'OPTIONS',
            /**
             * @constant
             * @type {String}
             * @default
             */
            PATCH: 'PATCH',
            /**
             * @constant
             * @type {String}
             * @default
             */
            HEAD: 'HEAD'
        }
    };

    request.serializeHandlers = {
        json: function(data) {
            if (typeof data !== 'string') {
                return JSON.stringify(data);
            } else {
                return data;
            }
        },
        'form-urlencoded': function(data) {
            return corbel.utils.toURLEncoded(data);
        }
    };

    request.serialize = function (data, contentType) {
        var serialized;
        Object.keys(request.serializeHandlers).forEach(function(type) {
            if (contentType.indexOf(type) !== -1) {
                serialized =  request.serializeHandlers[type](data);
            }
        });
        return serialized;
    };

    request.parseHandlers = {
        json: function(data) {
            data = data || '{}';
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            return data;
        },
        arraybuffer: function(data) {
            return new Uint8Array(data);
        },
        blob: function(data, dataType) {
            return new Blob([data], {
                type: dataType
            });
        },
        // @todo: xml
    };

    /**
     * Process the server response data to the specified object/array/blob/byteArray/text
     * @param  {Mixed} data                             The server response
     * @param  {String} type='array'|'blob'|'json'      The class of the server response
     * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
     * @return {Mixed}                                  Processed data
     */
    request.parse = function(data, responseType, dataType) {
        var parsed;
        Object.keys(request.parseHandlers).forEach(function(type) {
            if (responseType.indexOf(type) !== -1) {
                parsed = request.parseHandlers[type](data, dataType);
            }
        });
        return parsed;
    };

    /**
     * Public method to make ajax request
     * @param  {Object} options                                     Object options for ajax request
     * @param  {String} options.url                                 The request url domain
     * @param  {String} options.method                              The method used for the request
     * @param  {Object} options.headers                             The request headers
     * @param  {String} options.responseType                         The response type of the body
     * @param  {String} options.contentType                         The content type of the body
     * @param  {Object || Uint8Array || blob} options.dataType          Optional data sent to the server
     * @param  {Function} options.success                           Callback function for success request response
     * @param  {Function} options.error                             Callback function for handle error in the request
     * @return {ES6 Promise}                                        Promise about the request status and response
     */
    request.send = function(options) {
        options = options || {};

        if (!options.url) {
            throw new Error('undefined:url');
        }

        var params = {
            method: options.method || request.method.GET,
            url: options.url,
            headers: typeof options.headers === 'object' ? options.headers : {},
            callbackSuccess: options.success && typeof options.success === 'function' ? options.success : undefined,
            callbackError: options.error && typeof options.error === 'function' ? options.error : undefined,
            //responseType: options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
            dataType: options.responseType === 'blob' ? options.dataType || 'image/jpg' : undefined
        };

        // default content-type
        params.headers['content-type'] = options.contentType || 'application/json';

        var dataMethods = [request.method.PUT, request.method.POST, request.method.PATCH];
        if (dataMethods.indexOf(params.method) !== -1) {
            params.data = request.serialize(options.data, params.headers['content-type']);
        }

        // add responseType to the request (blob || arraybuffer || text)
        // httpReq.responseType = responseType;

        var promise = new Promise(function(resolve, reject) {

            var resolver = {
                resolve: resolve,
                reject: reject
            };

            if (typeof module !== 'undefined' && module.exports) { //nodejs
                nodeAjax.call(this, params, resolver);
            } else if (typeof window !== 'undefined') { //browser
                browserAjax.call(this, params, resolver);
            }
        }.bind(this));


        return promise;
    };

    var xhrSuccessStatus = {
        // file protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    };

    /**
     * Process server response
     * @param  {[Response object]} response
     * @param  {[Object]} resolver
     * @param  {[Function]} callbackSuccess
     * @param  {[Function]} callbackError
     */
    var processResponse = function(response, resolver, callbackSuccess, callbackError) {

        //xhr = xhr.target || xhr || {};
        var statusCode = xhrSuccessStatus[response.status] || response.status,
            statusType = Number(response.status.toString()[0]),
            promiseResponse;

        if (statusType < 3) {

            var data = response.response;
            if (response.response) {
                data = request.parse(response.response, response.responseType, response.dataType);
            }

            if (callbackSuccess) {
                callbackSuccess.call(this, data, statusCode, response.responseObject);
            }

            promiseResponse = {
                data: data,
                status: statusCode,
            };

            promiseResponse[response.responseObjectType] = response.responseObject;

            resolver.resolve(promiseResponse);

        } else if (statusType === 4) {

            if (callbackError) {
                callbackError.call(this, response.error, statusCode, response.responseObject);
            }

            promiseResponse = {
                data: response.responseObject,
                status: statusCode,
                error: response.error
            };

            promiseResponse[response.responseObjectType] = response.responseObject;

            resolver.reject(promiseResponse);
        }

    };


    var nodeAjax = function(params, resolver) {

        var request = require('request');

        request({
            method: params.method,
            url: params.url,
            headers: params.headers,
            body: params.data || ''
        }, function(error, response, body) {

            processResponse.call(this, {
                responseObject: response,
                dataType: params.dataType,
                responseType: response.responseType || response.headers['content-type'],
                response: body,
                status: response.statusCode,
                responseObjectType: 'response',
                error: error
            }, resolver, params.callbackSuccess, params.callbackError);

        }.bind(this));

    };

    /**
     * Check if an url should be process as a crossdomain resource.
     * @return {Boolean}
     */
    request.isCrossDomain = function(url) {
        if (url && url.indexOf('http') !== -1) {
            return true;
        } else {
            return false;
        }
    };

    var browserAjax = function(params, resolver) {

        var httpReq = new XMLHttpRequest();

        if (request.isCrossDomain(params.url) && params.withCredentials) {
            httpReq.withCredentials = true;
        }

        httpReq.open(params.method, params.url, true);

        /* add request headers */
        for (var header in params.headers) {
            if (params.headers.hasOwnProperty(header)) {
                httpReq.setRequestHeader(header, params.headers[header]);
            }
        }

        httpReq.onload = function(xhr) {
            xhr = xhr.target || xhr; // only for mock testing purpose

            processResponse.call(this, {
                responseObject: xhr,
                dataType: xhr.dataType,
                responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
                response: xhr.response || xhr.responseText,
                status: xhr.status,
                responseObjectType: 'xhr',
                error: xhr.error
            }, resolver, params.callbackSuccess, params.callbackError);

            //delete callbacks
        }.bind(this);

        //response fail ()
        httpReq.onerror = function(xhr) {
            xhr = xhr.target || xhr; // only for fake sinon response xhr

            processResponse.call(this, {
                responseObject: xhr,
                dataType: xhr.dataType,
                responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
                response: xhr.response || xhr.responseText,
                status: xhr.status,
                responseObjectType: 'xhr',
                error: xhr.error
            }, resolver, params.callbackSuccess, params.callbackError);

        }.bind(this);

        httpReq.send(params.data);
    };

    return request;

})();
