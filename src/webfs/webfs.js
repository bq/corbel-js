(function() {
  //@exclude
  'use strict';
  //@endexclude

  /**
   * A webfs API factory
   * @exports corbel.Webfs
   * @namespace
   * @extends corbel.Object
   * @memberof corbel
   */
  corbel.Webfs = corbel.Object.inherit({

    /**
     * Creates a new WebfsBuilder
     * @memberof corbel.Webfs.prototype
     * @param  {string} id String with the resource id 
     * @return {corbel.Webfs.WebfsBuilder}
     */
    constructor: function(driver) {
      this.driver = driver;
    },

    webfs: function(id) {
      return new corbel.Webfs.WebfsBuilder(this.driver, id);
    }

  }, {

    /**
     * moduleName constant
     * @constant
     * @memberof corbel.Webfs
     * @type {string}
     * @default
     */
    moduleName: 'webfs',

    /**
    * defaultPort constant
    * @constant
    * @memberof corbel.Webfs
    * @type {Number}
    * @default
    */
    defaultPort: 8096,

    /**
    * defaultDomain constant
    * @constant
    * @memberof corbel.Webfs
    * @type {Number}
    * @default
    */
    defaultDomain: 'unauthenticated',

    domain: 'domain',

    /**
     * AssetsBuilder factory
     * @memberof corbel.Webfs
     * @param  {corbel} corbel instance driver
     * @return {corbel.Webfs.WebfsBuilder}
     */
    create: function(driver) {
      return new corbel.Webfs(driver);
    }

  });

  return corbel.Webfs;

})();
