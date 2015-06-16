//@exclude
'use strict';
//@endexclude
(function() {

  /**
   * A base object to inherit from for make corbel-js requests with custom behavior.
   * @exports BaseServices
   * @namespace
   * @extends corbel.Object
   * @memberof corbel
   */
  var BaseServices = corbel.BaseServices = corbel.Object.inherit({ //instance props

    /**
     * Creates a new BaseServices
     * @memberof corbel.BaseServices.prototype
     * @param  {string}                         id String with the asset id or `all` key
     * @return {corbel.BaseServices}
     */
    constructor: function(driver) {
      this.driver = driver;
    },

    /**
     * Execute the actual ajax request.
     * Retries request with refresh token when credentials are needed.
     * Refreshes the client when a force update is detected.
     * Returns a server error (403 - unsupported_version) when force update max retries are reached
     *
     * @memberof corbel.BaseServices.prototype
     * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
     * @param  {object} args    The request arguments.
     */
    request: function(args) {

      var params = this._buildParams(args);

      var assignCaller = function(item) {
        if (corbel.utils.isJSON(item)) {
          try {
            var objectParsed = JSON.parse(item);
            objectParsed.caller = params.caller;
            item = JSON.stringify(objectParsed);
          } catch (e) {
            console.error(e);
          }
        }

        return item;
      };

      var assignResponseCallers = function(response) {
        // Any other error fail to the caller
        if (params.caller && response && response.data) {
          //Avoid read only states
          response.data = corbel.utils.clone(response.data);

          if (response.data.response) {
            response.data.response = assignCaller(response.data.response);
          }

          if (response.data.responseText) {
            response.data.responseText = assignCaller(response.data.responseText);
          }
        }
      };


      return corbel.request.send(params).then(function(response) {

        this.driver.config.set(corbel.Services._FORCE_UPDATE_STATUS, 0);

        return Promise.resolve(response);

      }.bind(this)).catch(function(response) {

        // Force update
        if (response.status === 403 &&
          response.textStatus === corbel.Services._FORCE_UPDATE_TEXT) {

          var retries = this.driver.config.get(corbel.Services._FORCE_UPDATE_STATUS, 0);
          if (retries < corbel.Services._FORCE_UPDATE_MAX_RETRIES) {
            retries++;
            this.driver.config.set(corbel.Services._FORCE_UPDATE_STATUS, retries);

            corbel.utils.reload(); //TODO nodejs
          } else {

            // Send an error to the caller
            assignResponseCallers(response);
            return Promise.reject(response);
          }
        } else {
          assignResponseCallers(response);
          return Promise.reject(response);
        }

      }.bind(this));
    },

    /**
     * Returns a valid corbel.request parameters with default values,
     * CORS detection and authorization params if needed.
     * By default, all request are json (dataType/contentType)
     * with object serialization support
     * 
     * @memberof corbel.BaseServices.prototype
     * @param  {object} args
     * @return {object}
     */
    _buildParams: function(args) {

      // Default values
      var defaults = {
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        dataFilter: corbel.Services.addEmptyJson,
        accessToken: this.driver.config.get('iamToken', {}).accessToken, // @todo: support to oauth token and custom handlers
        headers: {
          Accept: 'application/json'
        },
        method: corbel.request.method.GET
      };
      var params = corbel.utils.defaults(args, defaults);

      //Data
      params.data = (params.contentType.indexOf('json') !== -1 && typeof params.data === 'object' ? JSON.stringify(params.data) : params.data);

      if (!params.url) {
        throw new Error('You must define an url');
      }

      if (params.query) {
        params.url += '?' + params.query;
      }

      // Use access access token if exists
      if (params.accessToken) {
        params.headers.Authorization = 'Bearer ' + params.accessToken;
      }

      if (params.noRedirect) {
        params.headers['No-Redirect'] = true;
      }

      if (params.Accept) {
        params.headers.Accept = params.Accept;
        params.dataType = undefined; // Accept & dataType are incompatibles
      }

      // For binary requests like 'blob' or 'arraybuffer', set correct dataType
      params.dataType = params.binaryType || params.dataType;

      // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
      // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.method === 'PUT' || params.method === 'POST')) {
      //     params.processData = false;
      // }

      // console.log('services._buildParams (params)', params);
      // if (args.data) {
      //      console.log('services._buildParams (data)', args.data);
      // }

      return corbel.utils.pick(params, ['url', 'dataType', 'contentType', 'method', 'headers', 'data', 'dataFilter', 'caller']);
    },

    /**
     * @memberof corbel.BaseServices.prototype
     * @return {string}
     */
    _buildUri: function() {

      var uri = '';
      if (this.urlBase.slice(-1) !== '/') {
        uri += '/';
      }

      Array.prototype.slice.call(arguments).forEach(function(argument) {
        if (argument) {
          uri += argument + '/';
        }
      });

      // remove last '/'
      uri = uri.slice(0, -1);

      return this.urlBase + uri;
    }

  });

  return BaseServices;

})();
