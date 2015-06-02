//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {


  /**
   * A builder for composr requests.
   *
   * @param {String}  id phrase.
   *
   * @class
   * @memberOf corbel.CompoSR.RequestBuilder
   */
  corbel.CompoSR.RequestBuilder = corbel.Services.BaseServices.inherit({

    constructor: function(id) {
      this.id = id;
    },

    post: function(body) {
      console.log('composrInterface.request.post');
      return this.request({
        url: this._buildUri(this.id),
        method: corbel.request.method.POST,
        data: body,
      });
    },

    get: function() {
      console.log('composrInterface.request.get');
      return this.request({
        url: this._buildUri(this.id),
        method: corbel.request.method.GET
      });
    },

    put: function(body) {
      console.log('composrInterface.request.put');
      return this.request({
        url: this._buildUri(this.id),
        method: corbel.request.method.PUT,
        data: body,
      });
    },

    delete: function() {
      console.log('composrInterface.request.delete');
      return this.request({
        url: this._buildUri(this.id),
        method: corbel.request.method.DELETE
      });
    },

    _buildUri: corbel.CompoSR._buildUri

  });
})();
