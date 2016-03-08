//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a PaymentMethodsBuilder for payment managing requests.
   *
   * @return {corbel.Ec.PaymentMethodBuilder}
   */
  corbel.Ec.prototype.paymentMethod = function () {
    var paymentMethod = new PaymentMethodBuilder();
    paymentMethod.driver = this.driver;
    return paymentMethod;
  };

  /**
   * A builder for payment methods requests.
   *
   * @class
   * @memberOf corbel.Ec.PaymentMethodsBuilder
   */
  var PaymentMethodBuilder = corbel.Ec.PaymentMethodBuilder = corbel.Services.inherit({
    constructor: function () {
      this.uri = 'paymentmethod';
    },

    /**
     * Get the payment method registered for a user.
     *
     * @method
     * @memberOf corbel.Ec.PaymentMethodBuilder
     *
     * @return {Promise}                        Q promise that resolves to a Payment {Object} or rejects with a
     *                                          {@link SilkRoadError}
     */
    get: function () {
      console.log('ecInterface.paymentmethod.get');

      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.GET
      });
    },

    /**
     * Add a new payment method for the logged user.
     *
     * @method
     * @memberOf corbel.Ec.PaymentMethodBuilder
     *
     * @param {Object} params                 The params filter
     * @param {String} params.data            The card data encrypted
     *                                        (@see https://github.com/adyenpayments/client-side-encryption)
     * @param {String} params.name            User identifier related with de payment method
     *
     * @return {Promise}                      Q promise that resolves to a Payment {Object} or rejects with a
     *                                        {@link SilkRoadError}
     */
    add: function (params) {
      console.log('ecInterface.paymentmethod.add');

      return this.request({
          url: this._buildUri(this.uri),
          method: corbel.request.method.POST,
          data: params
        })
        .then(function (res) {
          return corbel.Services.getLocationId(res);
        });
    },

    /**
     * Get details of a single payment method by its id.
     *
     * @method
     * @memberOf corbel.Ec.PaymentMethodBuilder
     *
     * @param {String} id                Payment method identifier
     *
     * @return {Promise}                 Q promise that resolves to a Payment {Object} or rejects with a
     *                                   {@link SilkRoadError}
     */
    getById: function (id) {
      console.log('ecInterface.paymentmethod.get');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.GET
      });
    },

    /**
     * Deletes a payment method.
     *
     * @method
     * @memberOf corbel.Ec.PaymentMethodBuilder
     *
     * @param {String} id                Payment method identifier
     *
     * @return {Promise}                 Q promise that resolves to a Payment {Object} or rejects with a
     *                                   {@link SilkRoadError}
     */
    delete: function (id) {
      console.log('ecInterface.paymentmethod.delete');

      corbel.validate.value('id', id);
      return this.request({
        url: this._buildUri(this.uri, id),
        method: corbel.request.method.DELETE
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
