//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a OrderBuilder for order managing requests.
   *
   * @param {string}  id  The id of the order.
   *
   * @return {corbel.Ec.OrderBuilder}
   */
  corbel.Ec.prototype.order = function (id) {
    var order = new OrderBuilder(id);
    order.driver = this.driver;
    return order;
  };

  /**
   * A builder for order requests.
   *
   * @param {string}  id order ID.
   *
   * @class
   * @memberOf corbel.Ec.OrderBuilder
   */
  var OrderBuilder = corbel.Ec.OrderBuilder = corbel.Services.inherit({
    constructor: function (id) {
      if (id) {
        this.id = id;
      }
      this.uri = 'order';
    },

    /**
     * Gets an order
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     *
     * @return {Promise}        Q promise that resolves to a Order {Object} or rejects with a {@link SilkRoadError}
     */
    get: function () {
      console.log('ecInterface.order.get');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.GET
      });
    },

    /**
     * Updates the order
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     * @param  {Object} order                                   Data of the order to update
     * @param {Array} order.items                               Array of products to purchase
     * @param {String} order.items.productId                    Product related with the item
     * @param {Integer} order.items.quantity                    Number of products
     * @param {Object} order.items.price                        Price of the pruduct during the purchase
     * @param {String} order.items.price.concurrency            Currency code for the price (ISO code)
     * @param {String} order.items.price.amount                 The amount of the price
     * @param {String} order.items.productPaymentPlan.duration  Define the period of service has a validity in
     *                                                          ISO8601 period format
     * @param {String} order.items.productPaymentPlan.period    The data to hire the service has a validity in
     *                                                          ISO8601 period format
     * @param {Object[]} order.items                            Array of products to purchase
     * @return {Promise}                                        Q promise that resolves to undefined (void) or rejects
     *                                                          with a {@link SilkRoadError}
     */
    update: function (order) {
      console.log('ecInterface.order.update');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.PUT,
        data: order
      });
    },

    /**
     * Deletes the Order
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
     */
    delete: function () {
      console.log('ecInterface.order.delete');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.DELETE
      });
    },

    /**
     * Prepares the order, required to checkout
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     * @param {string[]} couponIds                Array of String with the coupons ids to prepare the order
     * @return {Promise}                          Q promise that resolves to undefined (void) or rejects with a
     *                                            {@link SilkRoadError}
     */
    prepare: function (couponIds) {
      console.log('ecInterface.order.prepare');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id, '/prepare'),
        method: corbel.request.method.POST,
        data: couponIds
      });
    },

    /**
     * Checks out the Order
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     * @param  {Object} data                    Purchase information to do the checkout
     * @param {string[]} data.paymentMethodIds  Array of String with the payment methods ids to checkout the order
     * @return {Promise}                        Promise that resolves in the new purchase id or rejects with a
     *                                          {@link SilkRoadError}
     */
    checkout: function (data) {
      console.log('ecInterface.order.checkout');

      if (!data.paymentMethodIds) {
        return Promise.reject(new Error('paymentMethodIds lists needed'));
      }
      if (!data.paymentMethodIds.length) {
        return Promise.reject(new Error('One payment method is needed at least'));
      }
      corbel.validate.value('id', this.id);
      return this.request({
        method: corbel.request.method.POST,
        url: this._buildUri(this.uri, this.id, '/checkout'),
        data: data
      }).then(function (res) {
        return corbel.Services.getLocationId(res);
      });
    },

    /**
     * Internal module uri builder
     * @method
     * @memberOf corbel.Ec.OrderBuilder
     * @return {string}
     */
    _buildUri: corbel.Ec._buildUri

  });

})();
