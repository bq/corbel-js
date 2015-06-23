//@exclude
'use strict';
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

    Iam.moduleName = 'iam';

    Iam.create = function(driver) {
        return new Iam(driver);
    };

    Iam.GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    Iam.AUD = 'http://iam.bqws.io';
    Iam.IAM_TOKEN = 'iamToken';
    Iam.IAM_TOKEN_SCOPES = 'iamScopes';

    /**
     * COMMON MIXINS
     */

    /**
     * Private method to build a string uri
     * @private
     * @param  {String} uri
     * @param  {String|Number} id
     * @return {String}
     */
    Iam._buildUri = function(uri, id) {
        if (id) {
            uri += '/' + id;
        }

        var urlBase = this.driver.config.get('iamEndpoint', null) ?
            this.driver.config.get('iamEndpoint') :
            this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, Iam.moduleName);

        return urlBase + uri;
    };

})();
