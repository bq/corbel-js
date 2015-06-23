//@exclude
'use strict';
//@endexclude

(function() {


    /**
     * A builder for composr requests.
     *
     *
     * @class
     * @memberOf corbel.CompoSR.RequestBuilder
     */
    corbel.CompoSR.RequestBuilder = corbel.Services.inherit({

        constructor: function(pathsArray) {
            this.path = this.buildPath(pathsArray);
        },

        post: function(data, options) {
            console.log('composrInterface.request.post');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.POST,
                headers: this.options.headers,
                data: data,
                query: this.buildQueryPath(this.options.queryParams)
            });
        },

        get: function(options) {
            console.log('composrInterface.request.get');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.GET,
                headers: this.options.headers,
                query: this.buildQueryPath(this.options.queryParams)
            });
        },

        put: function(data, options) {
            console.log('composrInterface.request.put');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.PUT,
                data: data,
                headers: this.options.headers,
                query: this.buildQueryPath(this.options.queryParams)
            });
        },

        delete: function(options) {
            console.log('composrInterface.request.delete');
            this.options = options || {};
            return this.request({
                url: this._buildUri(this.path),
                method: corbel.request.method.DELETE,
                headers: this.options.headers,
                query: this.buildQueryPath(this.options.queryParams)
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
