//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * @namespace
     * @memberOf corbel
     * @param {object} config
     * @return {CorbelDriver}
     */
    function CorbelDriver(config) {
        // create instance config
        this.guid = corbel.utils.guid();
        this.config = corbel.Config.create(config);

        // create isntance modules with injected driver
        this.iam = corbel.Iam.create(this);
        this.resources = corbel.Resources.create(this);
        this.assets = corbel.Assets.create(this);
        this.oauth = corbel.Oauth.create(this);
        this.notifications = corbel.Notifications.create(this);
        this.ec = corbel.Ec.create(this);
        this.evci = corbel.Evci.create(this);
        this.borrow = corbel.Borrow.create(this);
        this.composr = corbel.CompoSR.create(this);
    }

    /**
     * @return {CorbelDriver} A new instance of corbel driver with the same config
     */
    CorbelDriver.prototype.clone = function () {
        return new CorbelDriver(this.config.getConfig());
    };

    corbel.CorbelDriver = CorbelDriver;

    /**
     * Instanciates new corbel driver
     * @memberOf corbel
     * @param {object} config
     * @param {string} config.urlBase
     * @param {string} [config.clientId]
     * @param {string} [config.clientSecret]
     * @param {string} [config.scopes]
     * @return {corbel.CorbelDriver}
     */
    corbel.getDriver = function(config) {
        config = config || {};

        if (!config.urlBase) {
            throw new Error('error:undefined:urlbase');
        }

        return new CorbelDriver(config);
    };

})();
