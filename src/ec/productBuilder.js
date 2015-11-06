//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * Create a ProductBuilder for product managing requests.
   *
   * @param {String}  id  The id of the product.
   *
   * @return {corbel.Ec.ProductBuilder}
   */
  corbel.Ec.prototype.product = function(id) {
    var product = new ProductBuilder(id);
    product.driver = this.driver;
    return product;
  };
  /**
   * A builder for products management requests.
   *
   * @param {String}  id product ID.
   *
   * @class
   * @memberOf corbel.Ec.ProductBuilder
   */
  var ProductBuilder = corbel.Ec.ProductBuilder = corbel.Services.inherit({

    constructor: function(id) {
      if (id) {
        this.id = id;
      }
      this.uri = 'product';
    },

    /**
     * Create a new product.
     *
     * @method
     * @memberOf corbel.Ec.ProductBuilder
     * @param {Object} product                 Contains the data of the new product
     * @param {String} product.price           Information about price
     * @param {String} product.price.currency  Currency code fro the price
     * @param {Number} product.price.amount    The amount of the price
     * @param {String} href                 Link to ???
     * @param {String} type                 Type of the Product
     * @param {Object} [scopes]             Set of scopes of the product
     * @param {String} [period]             Duration of the Product
     * @param {Number} period.years
     * @param {Number} period.months
     * @param {Number} period.days
     * @param {String} [name]               Name of the Product
     * @return {Promise} A promise with the id of the created loanable resources or fails
     *                   with a {@link corbelError}.
     */
    create: function(product) {
      console.log('ecInterface.product.create', product);
      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: product
      }).then(function(res) {
        return corbel.Services.getLocationId(res);
      });
    },

    /**
     * Get a product.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @param  {Object} params  The params filter
     *
     * @return {Promise} A promise with product {Object} or fails with a {@link corbelError}.
     */
    get: function(params) {
      console.log('ecInterface.product.get');
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Update a product.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @param  {Object} product  The product update
     *
     * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
     */
    update: function(product) {
      console.log('ecInterface.product.update');
      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.PUT,
        data: product
      });
    },

    /**Delete a product.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
     */
    delete: function() {
      console.log('ecInterface.product.delete');
      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.DELETE
      });
    },

    _buildUri: corbel.Ec._buildUri

  });

})();
