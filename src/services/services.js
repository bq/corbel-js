//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * A module to make corbel requests.
   * @exports Services
   * @namespace
   * @extends corbel.BaseServices
   * @memberof corbel
   */
  var Services = corbel.Services = corbel.BaseServices.inherit({}, { //Static attrs

    /**
     * _FORCE_UPDATE_TEXT constant
     * @constant
     * @memberof corbel.Services
     * @type {string}
     * @default
     */
    _FORCE_UPDATE_TEXT: 'unsupported_version',

    /**
     * _FORCE_UPDATE_MAX_RETRIES constant
     * @constant
     * @memberof corbel.Services
     * @type {number}
     * @default
     */
    _FORCE_UPDATE_MAX_RETRIES: 3,

    /**
     * _FORCE_UPDATE_STATUS constant
     * @constant
     * @memberof corbel.Services
     * @type {string}
     * @default
     */
    _FORCE_UPDATE_STATUS: 'fu_r',

    /**
     * Factory method
     * @memberof corbel.Services
     * @param  {corbel} driver
     * @return {corbel.Services}
     */
    create: function(driver) {
      return new corbel.Services(driver);
    },

    /**
     * Extract a id from the location header of a requestXHR
     * @memberof corbel.Services
     * @param  {Promise} res response from a requestXHR
     * @return {String}  id from the Location
     */
    getLocationId: function(responseObject) {
      var location;

      if (responseObject.xhr) {
        location = arguments[0].xhr.getResponseHeader('location');
      } else if (responseObject.response.headers.location) {
        location = responseObject.response.headers.location;
      }
      return location ? location.substr(location.lastIndexOf('/') + 1) : undefined;
    },

    /**
     * @memberof corbel.Services
     * @param {mixed} response
     * @param {string} type
     * @return {midex}
     */
    addEmptyJson: function(response, type) {
      if (!response && type === 'json') {
        response = '{}';
      }
      return response;
    },

    /**
     * Proxy access to corbel.BaseServices
     * @type {corbel.BaseServices}
     */
    BaseServices: corbel.BaseServices
  });


  return Services;

})();
