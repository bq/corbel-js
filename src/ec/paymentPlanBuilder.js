//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PaymentPlanBuilder for payment managing requests.
   *
   * @return {corbel.Ec.PaymentPlanBuilder}
   */
  corbel.Ec.prototype.payment = function () {
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
     * @class
     * @memberOf corbel.Ec.PaymentPlanBuilder
     */
    add: function (params) {
      console.log('ecInterface.paymentplan.add');

      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: params
      });
    },

    /**
     * Gets details of a single payment plan by its id
     *
     * @class
     * @memberOf corbel.Ec.PaymentPlanBuilder
     */
     getById: function (id) {
      console.log('ecInterface.paymentplan.get');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.GET
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