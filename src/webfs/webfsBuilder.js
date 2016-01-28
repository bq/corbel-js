//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * Module for retrieve content of S3
   * @exports WebfsBuilder
   * @namespace
   * @extends corbel.Services
   * @memberof corbel.Webfs
   */
  var WebfsBuilder = corbel.Webfs.WebfsBuilder = corbel.Services.inherit({

    /**
     * Creates a new WebfsBuilder
     * @memberof corbel.Webfs.WebfsBuilder.prototype
     * @return {corbel.Webfs.WebfsBuilder}
     */
    constructor: function(driver, id) {
      this.driver = driver;
      this.id = id;
    },

    /**
     * Gets the content
     * @memberof corbel.Webfs.WebfsBuilder.prototype
     * @param  {object} [params]      Params of a {@link corbel.request}
     * @return {Promise}              Promise that resolves with a resource or rejects with a {@link CorbelError}
     */
    get: function(params) {

      corbel.validate.value('id', this.id);

      var options = params ? corbel.utils.clone(params) : {};

      var args = corbel.utils.extend(options, {
        url: this._buildUri(this.id),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });

      return this.request(args);

    },

    _buildUri: function(id) {
      var urlBase =  this.driver.config.getCurrentEndpoint(corbel.Webfs.moduleName, this._buildPort(this.driver.config));

      return urlBase + id;
    },

    _buildPort: function(config) {
      return config.get('webfsPort', null) || corbel.Webfs.defaultPort;
    }

  }, {

    /**
     * GET constant
     * @constant
     * @memberof corbel.Webfs.WebfsBuilder
     * @type {string}
     * @default
     */
    moduleName: 'webfs',

    /**
     * Factory
     * @memberof corbel.Webfs.WebfsBuilder
     * @type {string}
     * @default
     */
    create: function(driver) {
      return new corbel.Webfs.WebfsBuilder(driver);
    }

  });

  return WebfsBuilder;

})();
