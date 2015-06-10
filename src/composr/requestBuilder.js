//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {


    /**
     * A builder for composr requests.
     *
     *
     * @class
     * @memberOf corbel.CompoSR.RequestBuilder
     */
    corbel.CompoSR.RequestBuilder = corbel.Services.BaseServices.inherit({

        constructor: function(pathsArray) {
            this.path = this.buildPath(pathsArray);
        },

        post: function(data, options) {
            console.log('composrInterface.request.post');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.POST,
                headers: options.headers,
                data: data,
                query: this.buildQueryPath(options.queryParams)
            });
        },

        get: function(options) {
            console.log('composrInterface.request.get');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.GET,
                headers: options.headers,
                query: this.buildQueryPath(options.queryParams)
            });
        },

        put: function(data, options) {
            console.log('composrInterface.request.put');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.PUT,
                data: data,
                headers: options.headers,
                query: this.buildQueryPath(options.queryParams)
            });
        },

        delete: function(options) {
            console.log('composrInterface.request.delete');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.DELETE,
                headers: options.headers,
                query: this.buildQueryPath(options.queryParams)
            });
        },

        buildPath: function(pathArray) {
            var path = '';
            path += pathArray.shift();
            pathArray.forEach(function(entryPath) {
                path += '/' + entryPath;
            });
            return path;
        },

        buildQueryPath: function(dict) {
            var query = '';
            if (dict) {
                var queries = [];
                Object.keys(dict).forEach(function(key) {
                    queries.push(key + '=' + dict[key]);
                });
                if (queries.length > 0) {
                    query = queries.join('&');
                }
            }
            return query;
        },

        _buildUri: corbel.CompoSR._buildUri
    });
})();
