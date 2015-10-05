//@exclude
'use strict';
//@endexclude

(function() {


  /**
   * A builder for composr phrase crud.
   *
   * @param {String}  id phrase ID.
   *
   * @class
   * @memberOf corbel.CompoSR.PhraseBuilder
   */
  corbel.CompoSR.PhraseBuilder = corbel.Services.inherit({

    constructor: function(id) {
      this.id = id;
    },

    put: function(body) {
      console.log('composrInterface.phrase.add');
      return this.request({
        url: this._buildUri('phrase', this.id),
        method: corbel.request.method.PUT,
        data: body
      });
    },

    get: function() {
      console.log('composrInterface.phrase.get');
      return this.request({
        url: this._buildUri('phrase', this.id),
        method: corbel.request.method.GET
      });
    },

    getAll: function() {
      console.log('composrInterface.phrase.getAll');
      return this.request({
        url: this._buildUri('phrase'),
        method: corbel.request.method.GET
      });
    },

    delete: function() {
      console.log('composrInterface.phrase.delete');
      return this.request({
        url: this._buildUri('phrase', this.id),
        method: corbel.request.method.DELETE
      });
    },

    _buildUri: corbel.CompoSR._buildUri

  });
})();
