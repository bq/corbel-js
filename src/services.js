//@exclude

'use strict';

/* global corbel */

//deps: [corbel.Object, corbel.Session, corbel.request]

//@endexclude

(function() {

    /**
     * A module to make iam requests.
     * @exports Services
     * @namespace
     * @memberof corbel
     */
    corbel.Services = corbel.Object.inherit({ //instance props
        constructor: function(driver) {
            this.driver = driver;
        },
        /**
         * Execute the actual ajax request.
         * Retries request with refresh token when credentials are needed.
         * Refreshes the client when a force update is detected.
         * Returns a server error (403 - unsupported_version) when force update max retries are reached
         *
         * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
         * @param  {Object} args    The request arguments.
         */
        request: function(args) {

            var params = this._buildParams(args);
            return corbel.request.send(params).then(function(response) {

                this.driver.session.add(_FORCE_UPDATE_STATUS, 0);

                return Promise.resolve(response);

            }).catch(function(response) {

                // Force update
                if (response.status === 403 &&
                    response.textStatus === corbel.Services._FORCE_UPDATE_TEXT) {

                    var retries = this.driver.session.get(_FORCE_UPDATE_STATUS) || 0;
                    if (retries < corbel.Services._FORCE_UPDATE_MAX_RETRIES) {
                        retries++;
                        this.driver.session.add(_FORCE_UPDATE_STATUS, retries);

                        corbel.utils.reload(); //TODO nodejs
                    } else {

                        // Send an error to the caller
                        return Promise.reject(response);
                    }
                } else {
                    // Any other error fail to the caller
                    return Promise.reject(response);
                }

            }.bind(this));
        },
        /**
         * Returns a valid corbel.request parameters with default values,
         * CORS detection and authorization params if needed.
         * By default, all request are json (dataType/contentType)
         * with object serialization support
         * @param  {Object} args
         * @return {Object}
         */
        _buildParams: function(args) {

            // Default values
            args = args || {};

            args.dataType = args.dataType || 'json';
            args.contentType = args.contentType || 'application/json; charset=utf-8';
            args.dataFilter = args.dataFilter || corbel.Services.addEmptyJson;

            // Construct url with query string
            var url = args.url;

            if (!url) {
                throw new Error('You must define an url');
            }

            if (args.query) {
                url += '?' + args.query;
            }

            var headers = args.headers || {};

            // @todo: support to oauth token and custom handlers
            args.accessToken = args.accessToken || this.driver.config.get('IamToken', {}).accessToken;

            // Use access access token if exists
            if (args.accessToken) {
                headers.Authorization = 'Bearer ' + args.accessToken;
            }
            if (args.noRedirect) {
                headers['No-Redirect'] = true;
            }

            headers.Accept = 'application/json';
            if (args.Accept) {
                headers.Accept = args.Accept;
                args.dataType = undefined; // Accept & dataType are incompatibles
            }

            var params = {
                url: url,
                dataType: args.dataType,
                contentType: args.contentType,
                method: args.method || corbel.request.method.GET,
                headers: headers,
                data: (args.contentType.indexOf('json') !== -1 && typeof args.data === 'object' ? JSON.stringify(args.data) : args.data),
                dataFilter: args.dataFilter
            };

            // For binary requests like 'blob' or 'arraybuffer', set correct dataType
            params.dataType = args.binaryType || params.dataType;

            // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
            // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.method === 'PUT' || params.method === 'POST')) {
            //     params.processData = false;
            // }

            // console.log('services._buildParams (params)', params);
            // if (args.data) {
            //      console.log('services._buildParams (data)', args.data);
            // }

            return params;
        },

    }, { //Static props
        _FORCE_UPDATE_TEXT: 'unsupported_version',
        _FORCE_UPDATE_MAX_RETRIES: 3,
        // _FORCE_UPDATE_STATUS = 'fu_r',
        create: function(driver) {
            return new corbel.Services(driver);
        },
        /**
         * Extract a id from the location header of a requestXHR
         * @param  {Promise} res response from a requestXHR
         * @return {String}  id from the Location
         */
        getLocationId: function(responseObject) {
            var location;

            if (responseObject.xhr) {
                location = arguments[0].xhr.getResponseHeader('location');
            } else if (responseObject.response.headers.location) {
                location = responseObject.response.headers.location;
            }
            return location ? location.substr(location.lastIndexOf('/') + 1) : undefined;
        },
        addEmptyJson: function(response, type) {
            if (!response && type === 'json') {
                response = '{}';
            }
            return response;
        }
    });


    return corbel.Services;

})();