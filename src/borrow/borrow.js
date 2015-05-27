//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * A module to make Borrow requests.
     * @exports Borrow
     * @namespace
     * @memberof app.corbel
     */

    var Borrow = corbel.Borrow = function(driver) {
        this.driver = driver;
    };

    Borrow.moduleName = 'borrow';

    Borrow.create = function(driver) {
        return new Borrow(driver);
    };

    /**
     * COMMON MIXINS
     */

    /**
     * Private method to build a string uri
     * @private
     * @param  {Object} arguments
     * @return {String}
     */
    Borrow._buildUri = function() {
        var uri='';
        Array.prototype.slice.call(arguments).forEach(function(argument) {
          if (argument){
            uri+= '/' + argument;
          }
        });

        var urlBase = this.driver.config.get('borrowEndpoint', null) ||
              this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, Borrow.moduleName);

        if(urlBase.slice(-1) === '/') {
          urlBase = urlBase.substring(0, urlBase.length - 1);
        }

        return urlBase + uri;
    };
})();
