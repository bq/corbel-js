//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * A module to make Ec requests.
   * @exports Ec
   * @namespace
   * @memberof app.corbel
   */

  var Ec = corbel.Ec = function(driver) {
    this.driver = driver;
  };

  Ec.moduleName = 'ec';
  Ec.defaultPort = 8088;

  Ec.create = function(driver) {
    return new Ec(driver);
  };

  Ec._ec = {
    /**
     * @namespace
     */
    purchaseStates: {
      /**
       * IN_PROCESS constant
       * @constant
       * @type {String}
       * @default
       */
      IN_PROCESS: 'IN_PROCESS',

      /**
       * COMPLETED constant
       * @constant
       * @type {String}
       * @default
       */
      COMPLETED: 'COMPLETED',

      /**
       * FAILED constant
       * @constant
       * @type {String}
       * @default

      FAILED: 'FAILED',

      /**
       * IN_PAYMENT constant
       * @constant
       * @type {String}
       * @default
       */
      IN_PAYMENT: 'IN_PAYMENT',

      /**
       * CANCELLED constant
       * @constant
       * @type {String}
       * @default
       */
      CANCELLED: 'CANCELLED'
    }
  };

  /**
   * COMMON MIXINS
   */

  // Ec._encrypt = function (data) {
  //     return {
  //         name: data.name,
  //         data: cse.encrypt(data.number, data.holderName, data.cvc, data.expiryMonth, data.expiryYear)
  //     };
  // };

  /**
   * Private method to build a string uri
   * @private
   * @param  {String} uri
   * @param  {String|Number} id
   * @param  {String} extra
   * @return {String}
   */
  Ec._buildUri = function(uri, id, extra) {
    if (id) {
      uri += '/' + id;
    }
    if (extra) {
      uri += extra;
    }
    var urlBase = this._isRunningLocally(Ec.moduleName) ?
      this.driver.config.get('ecpoint') :
      this.driver.config.get('urlBase')
      .replace(corbel.Config.URL_BASE_PLACEHOLDER, Ec.moduleName)
      .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, Ec._buildPort(this.driver.config));

    return urlBase + uri;
  };

  Ec._buildPort = function(config) {
    return config.get('ecPort', null) || corbel.Ec.defaultPort;
  };

})();
