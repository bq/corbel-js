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
     * @param  {String} uri
     * @param  {String|Number} id
     * @param  {String} userId
     * @return {String}
     */
    Borrow._buildUri = function(uri, id, userId) {
        if (id) {
            uri += '/' + id;
        }
        if (userId) {
            uri += userId;
        }
        var urlBase = this.driver.config.get('borrowEndpoint', null) ?
            this.driver.config.get('borrowEndpoint') :
            this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, Borrow.moduleName);

        return urlBase + uri;
    };
})();
