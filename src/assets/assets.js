(function() {
  //@exclude
  'use strict';
  //@endexclude

  /**
   * An assets API factory
   * @exports corbel.Assets
   * @namespace
   * @extends corbel.Object
   * @memberof corbel
   */
  corbel.Assets = corbel.Object.inherit({

    /**
     * Creates a new AssetsBuilder
     * @memberof corbel.Assets.prototype
     * @param  {string} id String with the asset id or `all` key
     * @return {corbel.Assets.AssetsBuilder}
     */
    constructor: function(driver) {
      this.driver = driver;

      return function(id) {
        var builder = new corbel.Assets.AssetsBuilder(id);
        builder.driver = driver;
        return builder;
      };
    },


  }, {

    /**
     * moduleName constant
     * @constant
     * @memberof corbel.Assets
     * @type {string}
     * @default
     */
    moduleName: 'assets',

    /**
    * defaultPort constant
    * @constant
    * @memberof corbel.Assets
    * @type {Number}
    * @default
    */
    defaultPort: 8092,

    /**
     * AssetsBuilder factory
     * @memberof corbel.Assets
     * @param  {corbel} corbel instance driver
     * @return {corbel.Assets.AssetsBuilder}
     */
    create: function(driver) {
      return new corbel.Assets(driver);
    }

  });

  return corbel.Assets;

})();
