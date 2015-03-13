//@exclude
'use strict';
/*globals corbel */
//@endexclude

(function() {



    /**
     * Request object available for brwoser and node environment
     * @type {Object}
     */
    corbel.request = {};


    /**
     * Public method to make ajax request
     * @param  {Object} options                                     Object options for ajax request
     * @param  {String} options.url                                 The request url domain
     * @param  {String} options.method                              The method used for the request
     * @param  {Object} options.headers                             The request headers
     * @param  {String} options.contentType                         The content type of the body
     * @param  {Object || Uint8Array || blob} options.data          Optional data sent to the server
     * @param  {Function} options.success                           Callback function for success request response
     * @param  {Function} options.error                             Callback function for handle error in the request
     * @return {ES6 Promise}                                        Promise about the request status and response
     */
    corbel.request.send = function(options) {
        options = options || {};

        var params = {
            method: String((options.method || 'GET')).toUpperCase(),
            url: options.url,
            headers: typeof options.headers === 'object' ? options.headers : {},
            contentType: options.contentType || 'application/json',
            get isJSON() {
                return this.contentType.indexOf('json') !== -1 ? true : false;
            },
            callbackSuccess: options.success && typeof options.success === 'function' ? options.success : undefined,
            callbackError: options.error && typeof options.error === 'function' ? options.error : undefined,
            //responseType: options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
            dataType: options.responseType === 'blob' ? options.type || 'image/jpg' : undefined,
            get data() {
                return (params.method === 'PUT' || params.method === 'POST' || params.method === 'PATCH') ? options.data || {} : undefined;
            }
        };

        if (!params.url) {
            throw new Error('undefined:url');
        }


        // add responseType to the request (blob || arraybuffer || text)
        // httpReq.responseType = responseType;

        //add content - type header
        params.headers['content-type'] = params.contentType;

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
     * Process the server response data to the specified object/array/blob/byteArray/text
     * @param  {Mixed} data                             The server response
     * @param  {String} type='array'|'blob'|'json'      The class of the server response
     * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
     * @return {Mixed}                                  Processed data
     */
    var processResponseData = function(data, responseType, dataType) {
        var parsedData = data;

        if (responseType.indexOf('json') !== -1 && data) {
            parsedData = JSON.parse(parsedData + '');
        } else if (responseType === 'arraybuffer') {
            parsedData = new Uint8Array(data);
        } else if (responseType === 'blob') {
            parsedData = new Blob([data], {
                type: dataType
            });
        } else if (responseType.indexOf('xml') !== -1) {
            //parsear a xml
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
            var data = processResponseData(response.response, response.responseType, response.dataType);

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
            json: params.isJSON,
            body: params.data
        }, function(error, response, body) {

            processResponse.call(this, {
                responseObject: response,
                dataType: params.dataType,
                responseType: response.headers['content-type'],
                response: body,
                status: response.statusCode,
                responseObjectType: 'response',
                error: error
            }, resolver, params.callbackSuccess, params.callbackError);

        }.bind(this));

    };

    var browserAjax = function(params, resolver) {

        var httpReq = new XMLHttpRequest();


        httpReq.open(params.method, params.url, true);

        /* add request headers */
        for (var header in params.headers) {
            if (params.headers.hasOwnProperty(header)) {
                httpReq.setRequestHeader(header, params.headers[header]);
            }
        }

        httpReq.onload = function(xhr) {
            xhr = xhr.target || xhr; // only for fake sinon response xhr

            processResponse.call(this, {
                responseObject: xhr,
                dataType: xhr.dataType,
                responseType: xhr.getResponseHeader('content-type'), //xhr.responseType,
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
                responseType: xhr.responseType,
                response: xhr.response || xhr.responseText,
                status: xhr.status,
                responseObjectType: 'xhr',
                error: xhr.error
            }, resolver, params.callbackSuccess, params.callbackError);

        }.bind(this);

        if (params.data) {
            httpReq.send(serializeData(params.data, params.responseType));
        } else {
            httpReq.send();
        }

    };

    return corbel.request;

})();