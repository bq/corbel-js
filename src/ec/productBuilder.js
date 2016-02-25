//@exclude
'use strict';
//@endexclude

(function () {

  /**
   * Create a ProductBuilder for product managing requests.
   *
   * @param {String}  id  The id of the product.
   *
   * @return {corbel.Ec.ProductBuilder}
   */
  corbel.Ec.prototype.product = function (id) {
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

    constructor: function (id) {
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
     * @param {Object} product                        Contains the data of the new product
     * @param {Object} product.name                   The name of the product
     * @param {String} product.price                  Information about price
     * @param {String} product.price.currency         Currency code fro the price
     * @param {Number} product.price.amount           The amount of the price
     * @param {String} product.type                   Define the type of the product, which can trigger different
     *                                                behaviors
     * @param {String} product.href                   The resource uri
     * @param {Array}  product.assets                 Array with the permissions assigned to the product
     * @param {String} product.assets.name            Identifier of the asset
     * @param {String} product.assets.period          Define if the product asset has a validity in ISO8601
     *                                                period format
     * @param {Array}  product.assets.scopes          String array with the scopes associated with the asset
     * @param {Array}  product.paymentPlan            Array with the service associated to the product
     * @param {String} product.paymentPlan.duration   Define the period of service has a validity in ISO8601 period
     * @param {String} product.paymentPlan.period     The data to hire the service has a validity in ISO8601
     *                                                period format
     *
     * @return {Promise} A promise with the id of the created loanable resources or fails with a {@link corbelError}.
     */
    create: function (product) {
      console.log('ecInterface.product.create', product);

      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: product
      }).then(function (res) {
        return corbel.Services.getLocationId(res);
      });
    },

    /**
     * Get all products.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @param {Object} params                 The params filter
     * @param {Integer} params.api:pageSize   Number of result returned in the page (>0, default: 10)
     * @param {String} params.api:query       A search query expressed in silkroad query language
     * @param {Integer} params.api:page       The page to be returned. Pages are zero-indexed (Integer >=0)
     * @param {String} params.api:sort        Results orders. JSON with field to order and direction, asc or desc
     *
     * @return {Promise} A promise with product {Object} or fails with a {@link corbelError}.
     */
    getAll: function (params) {
      console.log('ecInterface.product.getAll');

      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Get a product.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @param {Object} params                       The params filter
     * @param {String} params.id                    Identifier of the product
     * @param {String} params.name                  The name of the product
     * @param {Object} params.price                 Price of the pruduct
     * @param {String} params.price.currency        Currency code for the price (ISO code)
     * @param {Float} params.price.amount           The amount of the price
     * @param {String} params.type                  Define the type of the product, wich can trigger diferent behaviors,
     *                                              for example, recurring-lisence.
     * @param {String} params.href                  The resource uri
     * @param {Array} params.assets                 Array with the permisions assigned to the product
     * @param {String} params.assets.name           Identifier of the asset
     * @param {String} params.assets.period         Define if the product asset has a validity in ISO8601 period format
     * @param {Array} params.assets.scopes          String array with the scopes associated with the asset
     * @param {Array} params.paymentPlan            Array with the service associated to the product
     * @param {String} params.paymentPlan.duration  Define the period of service has a validity in ISO8601 period format
     * @param {String} params.paymentPlan.period    The data to hire the service has a validity in ISO8601 period format
     *
     * @return {Promise} A promise with product {Object} or fails with a {@link corbelError}.
     */
    get: function (params) {
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
     * @param {Object} product                      The product update
     * @param {String} product.name                 The name of the product
     * @param {Object} product.price                Price of the pruduct
     * @param {String} product.price.currency       Currency code for the price (ISO code)
     * @param {Float} product.price.amount          The amount of the price
     * @param {String} product.type                 Define the type of the product, wich can trigger diferent behaviors,
     *                                              for example, recurring-lisence. (UNDER DEFINITION)
     * @param {String} product.href                 The resource uri
     * @param {Array} product.assets                Array with the permisions assigned to the product
     * @param {String} product.assets.name          Identifier of the asset
     * @param {String} product.assets.period        Define if the product asset has a validity in ISO8601 period format
     * @param {String} product.assets.scopes        String array with the scopes associated with the asset
     * @param {Object} product.paymentPlan          Object with the service associated to the product
     * @param {String} product.paymentPlan.duration Define the period of service has a validity in ISO8601 period format
     * @param {String} product.paymentPlan.period   The data to hire the service has a validity in ISO8601 period format
     *
     * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
     */
    update: function (product) {
      console.log('ecInterface.product.update');

      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.PUT,
        data: product
      });
    },

    /**
     * Delete a product.
     *
     * @method
     * @memberOf corbel.Ec.EcBuilder
     *
     * @return {Promise} A promise resolves to undefined (void) or fails with a {@link corbelError}.
     */
    delete: function () {
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
