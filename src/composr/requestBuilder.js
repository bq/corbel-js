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

        post: function(payload) {
            console.log('composrInterface.request.post');
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.POST,
                headers: payload.headers,
                data: payload.body,
                query: this.buildQueryPath(payload.queryParams)
            });
        },

        get: function(payload) {
            console.log('composrInterface.request.get');
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.GET,
                headers: payload.headers,
                query: this.buildQueryPath(payload.queryParams)
            });
        },

        put: function(payload) {
            console.log('composrInterface.request.put');
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.PUT,
                data: payload.body,
                headers: payload.headers,
                query: this.buildQueryPath(payload.queryParams)
            });
        },

        delete: function(payload) {
            console.log('composrInterface.request.delete');
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.DELETE,
                headers: payload.headers,
                query: this.buildQueryPath(payload.queryParams)
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
