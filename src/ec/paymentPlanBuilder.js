//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PaymentPlanBuilder for payment managing requests.
   *
   * @param {String} id payment plan id
   *
   * @return {corbel.Ec.PaymentPlanBuilder}
   */
  corbel.Ec.prototype.paymentPlan = function (id) {
    var paymentPlan = new PaymentPlanBuilder(id);
    paymentPlan.driver = this.driver;
    return paymentPlan;
  };

  /**
   * A builder for payment requests.
   *
   * @class
   * @memberOf corbel.Ec.PaymentPlanBuilder
   */
  var PaymentPlanBuilder = corbel.Ec.PaymentPlanBuilder = corbel.Services.inherit({
    constructor: function (id) {
      this.id = id;
      this.uri = 'paymentplan';
    },

    /**
     * Gets the payment plans of the logged user
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     */
    get: function (userId) {
      console.log('ecInterface.paymentplan.get');

      return this.request({
        url: this._buildUri(this.uri, this.id, null, userId),
        method: corbel.request.method.GET,
      });
    },

    /**
     * Deletes a payment plan.
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {String} id                Payment method identifier
     *
     * @return {Promise}                 Q promise that resolves to a Payment {Object} or rejects with a
     *                                   {@link SilkRoadError}
     */
    delete: function (id) {
      console.log('ecInterface.paymentplan.delete');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.DELETE
      });
    },

    /**
     * Change the payment plan status from terminated to open (reactivated the payment plan)
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {String} id                Payment method identifier
     *
     */
     rescue: function(id){
      console.log('ecInterface.paymentplan.rescue');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id,'/rescue'),
        method: corbel.request.method.PUT
      });
     },

    /**
     * Updates the payment plan price
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {String} id                Payment method identifier
     *
     */
    updatePrice: function(params){
      console.log('ecInterface.paymentplan.updatePrice');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id, '/price'),
        method: corbel.request.method.PUT,
        data: params
      });
    },

     /**
     * Change the payment method of a payment plan
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {Object} params                      The update params, they include payment Method id
     *
     */
     updatePaymentMethod: function(params, userId){
      console.log('ecInterface.paymentplan.updatePaymentMethod');

      corbel.validate.value('id', this.id);

      return this.request({
        url: this._buildUri(this.uri, this.id, '/paymentmethod', userId),
        method: corbel.request.method.PUT,
        data: params
     });
     },

     /**
     * Gets payment plans paginated, this endpoint is only for admins
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     * @param {Object} params                 The params filter
     * @param {Integer} params.api:pageSize   Number of result returned in the page (>0 , default: 10)
     * @param {String} params.api:query       A search query expressed in silkroad query language
     * @param {Integer} params.api:page       The page to be returned. Pages are zero-indexed (>0, default:0)
     * @param {String} params.api:sort        Results orders. JSON with field to order and direction, asc or desc
     *
     * @return {Promise}        Q promise that resolves to a Payment {Object} or rejects with a {@link SilkRoadError}
     */
    getAll: function (params) {
      console.log('ecInterface.paymentplan.getAll');

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