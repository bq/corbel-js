// @exclude
'use strict'
// @endexclude
/* global corbel */

;(function () {
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
    constructor: function (driver) {
      this.driver = driver
    },

    asset: function (id) {
      return new corbel.Assets.AssetsBuilder(this.driver, id)
    }

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
    create: function (driver) {
      return new corbel.Assets(driver)
    }

  })

  return corbel.Assets
})()
