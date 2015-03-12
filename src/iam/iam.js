//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * A module to make iam requests.
     * @exports iam
     * @namespace
     * @memberof app.corbel
     */

    var Iam = corbel.Iam = function(driver) {
        this.driver = driver;
    };

    Iam.create = function(driver) {
        return new Iam(driver);
    };

    Iam.GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    Iam.AUD = 'http://iam.bqws.io';

    /**
     * COMMON MIXINS
     */

    /**
     * Provate method to build a tring uri
     * @private
     * @param  {String} uri
     * @param  {String|Number} id
     * @return {String}
     */
    Iam._buildUri = function(uri, id) {
        if (id) {
            uri += '/' + id;
        }
        return this.driver.config.get('iamEndpoint') + uri;
    };

})();
