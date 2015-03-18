//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    var services = corbel.services = {};

    var _FORCE_UPDATE_TEXT = 'unsupported_version',
        _FORCE_UPDATE_MAX_RETRIES = 3;
    // _FORCE_UPDATE_STATUS = 'fu_r';

    /**
     * Extract a id from the location header of a requestXHR
     * @param  {Promise} res response from a requestXHR
     * @return {String}  id from the Location
     */
    services.getLocationId = function(responseObject) {
        var location;

        if (responseObject.xhr) {
            location = arguments[0].xhr.getResponseHeader('location');
        } else if (responseObject.response.headers.location) {
            location = responseObject.response.headers.location;
        }
        return location ? location.substr(location.lastIndexOf('/') + 1) : undefined;
    };

    /**
     * Generic Services request.
     * Support all corbel.request parameters and more:
     * @param {Object} args
     * @param {String} [args.method=app.services.method.GET]
     * @param {String} [args.accessToken] set request with auth. (accessToken overrides args.withAuth)
     * @param {Boolean} [args.withAuth] set request with auth. (if not exists args.accessToken)
     * @param {Boolean} [args.noRetry] [Disable automatic retry strategy]
     * @param {String} [args.retryHook] [reqres hook to retry refresh token]
     * @return {ES6 Promise}
     */
    services.request = function(args) {
        return new Promise(function(resolve, reject) {

            services.makeRequest({
                resolve: resolve,
                reject: reject
            }, args);

        });
    };

    /**
     * Execute the actual ajax request.
     * Retries request with refresh token when credentials are needed.
     * Refreshes the client when a force update is detected.
     * Returns a server error (403 - unsupported_version) when force update max retries are reached
     *
     * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
     * @param  {Object} args    The request arguments.
     */
    services.makeRequest = function(args) {

        var params = services.buildParams(args);
        return corbel.request.send(params).then(function(response) {

            // session.add(_FORCE_UPDATE_STATUS, 0); //TODO SESSION

            return Promise.resolve(response);

        }).catch(function(response) {
            // Force update
            if (response.status === 403 &&
                response.textStatus === _FORCE_UPDATE_TEXT) {

                var retries = /*session.get(_FORCE_UPDATE_STATUS) ||*/ 0; //TODO SESSION
                if (retries < _FORCE_UPDATE_MAX_RETRIES) {
                    // console.log('services.request.force_update.reload', retries);
                    retries++;
                    // session.add(_FORCE_UPDATE_STATUS, retries); //TODO SESSION

                    //corbel.utils.reload();
                } else {
                    // console.log('services.request.force_update.fail');

                    // Send an error to the caller
                    return Promise.reject(response);
                }
            } else {
                // Any other error fail to the caller
                return Promise.reject(response);
            }

        });
    };

    /**
     * Returns a valid corbel.request parameters with default values,
     * CORS detection and authorization params if needed.
     * By default, all request are json (dataType/contentType)
     * with object serialization support
     * @param  {Object} args
     * @return {Object}
     */
    services.buildParams = function(args) {

        // Default values
        args = args || {};

        // args.dataType = args.dataType || 'json';
        // args.contentType = args.contentType || 'application/json; charset=utf-8';
        args.dataFilter = args.dataFilter || addEmptyJson;

        // Construct url with query string
        var url = args.url;

        if (!url) {
            throw new Error('You must define an url');
        }

        if (args.query) {
            url += '?' + args.query;
        }

        var headers = args.headers || {};
        // Use access access token if exists
        if (args.accessToken) {
            headers.Authorization = 'Bearer ' + args.accessToken;
        }
        if (args.noRedirect) {
            headers['No-Redirect'] = true;
        }
        if (args.Accept) {
            headers.Accept = args.Accept;
            args.dataType = undefined; // Accept & dataType are incompatibles
        }

        var params = {
            url: url,
            dataType: args.dataType,
            contentType: args.contentType,
            type: args.method || corbel.request.method.GET,
            headers: headers,
            data: (args.contentType.indexOf('json') !== -1 && typeof args.data === 'object' ? JSON.stringify(args.data) : args.data),
            dataFilter: args.dataFilter
        };

        // For binary requests like 'blob' or 'arraybuffer', set correct dataType
        params.dataType = args.binaryType || params.dataType;

        // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
        // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.type === 'PUT' || params.type === 'POST')) {
        //     params.processData = false;
        // }

        // console.log('services.buildParams (params)', params);
        // if (args.data) {
        //      console.log('services.buildParams (data)', args.data);
        // }

        return params;
    };

    var addEmptyJson = function(response, type) {
        if (!response && type === 'json') {
            response = '{}';
        }
        return response;
    };

    return services;

})();
