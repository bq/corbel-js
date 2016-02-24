//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PaymentPlanBuilder for payment managing requests.
   *
   * @return {corbel.Ec.PaymentPlanBuilder}
   */
  corbel.Ec.prototype.paymentPlan = function () {
    var paymentPlan = new PaymentPlantBuilder();
    paymentPlan.driver = this.driver;
    return paymentPlan;
  };

  /**
   * A builder for payment requests.
   *
   * @class
   * @memberOf corbel.Ec.PaymentPlanBuilder
   */
  var PaymentPlanBuilder = corbel.Ec.PaymentPLanBuilder = corbel.Services.inherit({
    constructor: function () {
      this.uri = 'paymentplan';
    },

    /**
     * Gets the payment plans of the logged user
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     */
    get: function () {
      console.log('ecInterface.paymentplan.get');

      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.GET,
      });
    },

    /**
     * Gets details of a single payment plan by its id
     *
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {String} id                Payment method identifier
     *
     * @return {Promise}                 Q promise that resolves to a Payment {Object} or rejects with a
     *                                   {@link SilkRoadError}
     */
     getById: function (id) {
      console.log('ecInterface.paymentplan.getById');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.GET
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
        url: this._buildUri(this.uri, id,'rescue'),
        method: corbel.request.method.PUT,
      });
     },

     /**
     * Change the payment method of a playment plan
     * 
     * @method
     * @memberOf corbel.Ec.PaymentPlanBuilder
     *
     * @param {String} id                           Payment method identifier
     * @param {Object} product                      The product update
     * @param {String} product.paymentMethodId      Identifier of the payment method to use with the plan
     *
     */
     update: function(id,product){
      console.log('ecInterface.paymentplan.update');

      corbel.validate.value('id', id,'paymentmethod');
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.PUT,
        data: product
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