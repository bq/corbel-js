//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * Module for organize user assets
   * @exports AssetsBuilder
   * @namespace
   * @extends corbel.Services
   * @memberof corbel.Assets
   */
  var AssetsBuilder = corbel.Assets.AssetsBuilder = corbel.Services.inherit({

    /**
     * Creates a new AssetsBuilder
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @param  {string}                         id string with the asset id or `all` key
     * @return {corbel.Assets.AssetsBuilder}
     */
    constructor: function(driver, id) {
      this.driver = driver;
      this.uri = 'asset';
      this.id = id;
    },

    /**
     * Gets my user assets
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @param  {object} [params]      Params of a {@link corbel.request}
     * @return {Promise}              Promise that resolves with an Asset or rejects with a {@link CorbelError}
     */
    get: function(params) {

      var options = params ? corbel.utils.clone(params) : {};

      var args = corbel.utils.extend(options, {
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });

      return this.request(args);

    },

   /**
     * Gets all assets
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @param  {object} [params]      Params of a {@link corbel.request}
     * @return {Promise}              Promise that resolves with an Asset or rejects with a {@link CorbelError}
     */
     getAll: function(params){
      var options = params ? corbel.utils.clone(params) : {};

      var args = corbel.utils.extend(options, {
        url: this._buildUri(this.uri, 'all'),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
      return this.request(args);
    },

    /**
     * Delete asset
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @return {Promise}                Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
     */
    delete: function() {
      corbel.validate.value('id', this.id);
      return this.request({
        url: this._buildUri(this.uri, this.id),
        method: corbel.request.method.DELETE
      });
    },

    /**
     * Creates a new asset
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @param {object}  data            Contains the data of the new asset
     * @param {string}  data.userId     The user id
     * @param {string}  data.name       The asset name
     * @param {date}    data.expire     Expire date
     * @param {boolean} data.active     If asset is active
     * @param {array}   data.scopes     Scopes of the asset
     * @return {Promise}                Promise that resolves in the new asset id or rejects with a {@link CorbelError}
     */
    create: function(data) {
      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: data
      }).
      then(function(res) {
        return corbel.Services.getLocationId(res);
      });
    },

    /**
     * Generates a JWT that contains the scopes of the actual user's assets and redirects to iam to upgrade user's token
     * @memberof corbel.Assets.AssetsBuilder.prototype
     * @return {Promise} Promise that resolves to a redirection to iam/oauth/token/upgrade or rejects with a {@link CorbelError}
     */
    access: function(params) {
      var args = params ? corbel.utils.clone(params) : {};
      args.url = this._buildUri(this.uri + '/access');
      args.method = corbel.request.method.GET;
      args.noRedirect = true;

      var that = this;

      return this.request(args).
      then(function(response) {
        return that.request({
          noRetry: args.noRetry,
          method: corbel.request.method.POST,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          data:response.data,
          url: response.headers.Location
        });
      });
    },

    _buildUri: function(path, id) {
      var uri = '',
        urlBase = this.driver.config.get('assetsEndpoint', null) ?
        this.driver.config.get('assetsEndpoint') :
        this.driver.config.get('urlBase')
        .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Assets.moduleName)
        .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, this._buildPort(this.driver.config));

      uri = urlBase + path;
      if (id) {
        uri += '/' + id;
      }
      return uri;
    },

    _buildPort: function(config) {
      return config.get('assetsPort', null) || corbel.Assets.defaultPort;
    }

  }, {

    /**
     * GET constant
     * @constant
     * @memberof corbel.Assets.AssetsBuilder
     * @type {string}
     * @default
     */
    moduleName: 'assets',

    /**
     * Factory
     * @memberof corbel.Assets.AssetsBuilder
     * @type {string}
     * @default
     */
    create: function(driver) {
      return new corbel.Assets.AssetsBuilder(driver);
    }

  });

  return AssetsBuilder;

})();