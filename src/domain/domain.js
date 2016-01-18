(function() {
  //@exclude
  'use strict';
  //@endexclude

  /**
   * A custom domain configuration
   * @exports corbel.Domain
   * @namespace
   * @extends corbel.Object
   * @memberof corbel
   */
  corbel.Domain = corbel.Object.inherit({

    /**
     * Creates a new instance of corbelDriver with a custom domain
     * @memberof corbel.Domain.prototype
     * @param  {string} id String with the custom domain value
     * @return {corbelDriver}
     */
    constructor: function(driver) {
      this.driver = driver;

      return function(id) {
        var newDriver = driver.clone();
        newDriver.config.set(corbel.Domain.CUSTOM_DOMAIN, id);

        return newDriver;
      };
    }


  }, {

    /**
     * moduleName constant
     * @constant
     * @memberof corbel.Domain
     * @type {string}
     * @default
     */
    moduleName: 'domain',

    /**
    * customDomain constant
    * @constant
    * @memberof corbel.Domain
    * @type {Number}
    * @default
    */
    CUSTOM_DOMAIN: 'customDomain',

    /**
     * Domain factory
     * @memberof corbel.Domain
     * @param  {corbel} corbel instance driver
     * @return {function}
     */
    create: function(driver) {
      return new corbel.Domain(driver);
    }

  });

  return corbel.Domain;

})();
