//@exclude

'use strict';

/* global corbel */

//deps: [corbel.utils, corbel.Config, corbel.Iam, corbel.Resources, corbel.Services, Corbel.Session]

//@endexclude

(function() {

    function CorbelDriver(config) {
        // create instance config
        this.guid = corbel.utils.guid();
        this.config = corbel.Config.create(config);

        // create isntance modules with injected driver
        this.iam = corbel.Iam.create(this);
        this.resources = corbel.Resources.create(this);
        this.assets = corbel.Assets.create(this);
        this.services = corbel.Services.create(this);
        this.session = corbel.Session.create(this);
        this.oauth = corbel.Oauth.create(this);
        this.notifications = corbel.Notifications.create(this);
        this.ec = corbel.Ec.create(this);
    }

    corbel.CorbelDriver = CorbelDriver;

    /**
     * Instanciates new corbel driver
     * @param {Object} config
     * @param {String} config.urlBase
     * @param {String} [config.clientId]
     * @param {String} [config.clientSecret]
     * @param {String} [config.scopes]
     * @return {CorbelDriver}
     */
    corbel.getDriver = function(config) {
        config = config || {};

        if (!config.urlBase) {
            throw new Error('error:undefined:urlbase');
        }

        return new CorbelDriver(config);
    };

})();
