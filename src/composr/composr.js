//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * A module to make CompoSR requests.
   * @exports CompoSR
   * @namespace
   * @memberof app.corbel
   */

  corbel.CompoSR = corbel.Object.inherit({

    constructor: function(driver) {
      this.driver = driver;
    },

    /**
     * Create a PhraseBuilder for phrase managing requests.
     *
     * @param {String}  id  The id of the phrase.
     *
     * @return {corbel.CompoSR.PhraseBuilder}
     */
    phrase: function(id) {
      var phraseBuilder = new corbel.CompoSR.PhraseBuilder(id);
      phraseBuilder.driver = this.driver;
      return phraseBuilder;
    },

    /**
     * Create a RequestBuilder for phrase requests.
     *
     * @param  {String} id      phrase id
     * @param  {String} param1  path parameter
     * @param  {String} param2  path parameter
     * @param  {String} paramN  path parameter
     *
     * @return {corbel.CompoSR.RequestBuilder}
     */
    request: function() {
      var requestBuilder = new corbel.CompoSR.RequestBuilder(Array.prototype.slice.call(arguments));
      requestBuilder.driver = this.driver;
      return requestBuilder;
    }


  }, {

    moduleName: 'composr',
    defaultPort: 3000,

    create: function(driver) {
      return new corbel.CompoSR(driver);
    },

    _buildPort: function(config) {
      return config.get('composrPort', null) || corbel.CompoSR.defaultPort;
    },

    _buildUri: function() {
      var urlBase = this._isRunningLocally(corbel.CompoSR.moduleName) ? 
        this.driver.config.get('composrEndpoint', null) :
        this.driver.config.get('urlBase')
          .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.CompoSR.moduleName)
          .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, corbel.CompoSR._buildPort(this.driver.config));

      if (urlBase.slice(-1) === '/') {
        urlBase = urlBase.substring(0, urlBase.length - 1);
      }

      var uri = '';
      Array.prototype.slice.call(arguments).forEach(function(argument) {
        if (argument) {
          uri += '/' + argument;
        }
      });
      return urlBase + uri;
    }

  });

  return corbel.CompoSR;

})();
