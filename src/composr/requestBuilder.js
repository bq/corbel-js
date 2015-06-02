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

    post: function(body, queryParams) {
      console.log('composrInterface.request.post');
      return this.request({
        url: this._buildUri(this.path),
        method: corbel.request.method.POST,
        data: body,
        query: this.buildQueryPath(queryParams)
      });
    },

    get: function(queryParams) {
      console.log('composrInterface.request.get');
      return this.request({
        url: this._buildUri(this.path),
        method: corbel.request.method.GET,
        query: this.buildQueryPath(queryParams)
      });
    },

    put: function(body, queryParams) {
      console.log('composrInterface.request.put');
      return this.request({
        url: this._buildUri(this.path),
        method: corbel.request.method.PUT,
        data: body,
        query: this.buildQueryPath(queryParams)
      });
    },

    delete: function(queryParams) {
      console.log('composrInterface.request.delete');
      return this.request({
        url: this._buildUri(this.path),
        method: corbel.request.method.DELETE,
        query: this.buildQueryPath(queryParams)
      });
    },

    buildPath : function(pathArray) {
      var path = '';
      path += pathArray.shift();
      pathArray.forEach(function(entryPath) {
        path += '/' + entryPath;
      });
      return path;
    },

    buildQueryPath : function(dict) {
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
