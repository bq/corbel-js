//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PaymentBuilder for payment managing requests.
   *
   * @return {corbel.Ec.PaymentBuilder}
   */
  corbel.Ec.prototype.payment = function () {
    var payment = new PaymentBuilder();
    payment.driver = this.driver;
    return payment;
  };

  /**
   * A builder for payment requests.
   *
   * @class
   * @memberOf corbel.Ec.PaymentBuilder
   */
  var PaymentBuilder = corbel.Ec.PaymentBuilder = corbel.Services.inherit({
    constructor: function () {
      this.uri = 'payment';
    },

    /**
     * Gets all payments for the logged user.
     *
     * @method
     * @memberOf corbel.Ec.PaymentBuilder
     * @param {Object} params                 The params filter
     * @param {Integer} params.api:pageSize   Number of result returned in the page (>0 , default: 10)
     * @param {String} params.api:query       A search query expressed in silkroad query language
     * @param {Integer} params.api:page       The page to be returned. Pages are zero-indexed (>0, default:0)
     * @param {String} params.api:sort        Results orders. JSON with field to order and direction, asc or desc
     *
     * @return {Promise}                      Q promise that resolves to a Payment {Object} or rejects with a
     *                                        {@link SilkRoadError}
     */
    get: function (params, userId) {
      console.log('ecInterface.payment.get');

      return this.request({
        url: this._buildUri(this.uri, null, null, userId),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Get payments paginated, this endpoint is only for admins.
     *
     * @method
     * @memberOf corbel.Ec.PaymentBuilder
     * @param {Object} params                 The params filter
     * @param {Integer} params.api:pageSize   Number of result returned in the page (>0 , default: 10)
     * @param {String} params.api:query       A search query expressed in silkroad query language
     * @param {Integer} params.api:page       The page to be returned. Pages are zero-indexed (>0, default:0)
     * @param {String} params.api:sort        Results orders. JSON with field to order and direction, asc or desc
     *
     * @return {Promise}        Q promise that resolves to a Payment {Object} or rejects with a {@link SilkRoadError}
     */
    getAll: function (params) {
      console.log('ecInterface.payment.getAll');

      return this.request({
        url: this._buildUri(this.uri, 'all'),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Internal module uri builder
     * @method
     * @memberOf corbel.Ec.PaymentBuilder
     * @return {string}
     */
    _buildUri: corbel.Ec._buildUri

  });

})();
