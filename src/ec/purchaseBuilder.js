//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PurchaseBuilder for purchase managing requests.
   *
   * @return {corbel.Ec.PurchaseBuilder}
   */
  corbel.Ec.prototype.purchase = function () {
    var purchase = new PurchaseBuilder();
    purchase.driver = this.driver;
    return purchase;
  };

  /**
   * A builder for purchase requests.
   *
   * @class
   * @memberOf corbel.Ec.PurchaseBuilder
   */
  var PurchaseBuilder = corbel.Ec.PurchaseBuilder = corbel.Services.inherit({
    constructor: function () {
      this.uri = 'purchase';
    },

    /**
     * Gets a purchase
     *
     * @method
     * @memberOf corbel.Ec.PurchaseBuilder
     *
     * @param id                              Purchase Identifier
     * @return {Promise}                      Q promise that resolves to a Purchase {Object} or rejects with a
     *                                        {@link SilkRoadError}
     */
    get: function (id) {
      console.log('ecInterface.purchase.get');

      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.GET
      });
    },

    /**
     * Gets all purchases for the logged user.
     * @method
     * @memberOf corbel.Ec.PurchaseBuilder
     *
     * @param {Object} params                 The params filter
     * @param {Integer} params.api:pageSize   Number of result returned in the page (>0 , default: 10)
     * @param {String} params.api:query       A search query expressed in silkroad query language
     * @param {Integer} params.api:page       The page to be returned. Pages are zero-indexed (>0, default:0)
     * @param {String} params.api:sort        Results orders. JSON with field to order and direction, asc or desc
     *
     * @return {Promise}        Q promise that resolves to a Purchase {Object} or rejects with a {@link SilkRoadError}
     */
    getAll: function (params) {
      console.log('ecInterface.purchase.getAll');

      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Internal module uri builder
     * @method
     * @memberOf corbel.Ec.PurchaseBuilder
     * @return {string}
     */
    _buildUri: corbel.Ec._buildUri

  });

})();
