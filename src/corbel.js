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
        this.services = corbel.Services.create(this);
        this.session = corbel.Session.create(this);
    }

    corbel.CorbelDriver = CorbelDriver;

    /**
     * Instanciates new corbel driver
     * @param {Object} config
     * @param {String} config.urlBase
     * @param {String} [config.urlBase]
     * @param {String} [config.clientId]
     * @param {String} [config.clientSecret]
     * @param {String} [config.scopesApp]
     * @param {String} [config.scopesUserLogin]
     * @param {String} [config.scopesUserCreate]
     * @param {String} [config.resourcesEndpoint]
     * @param {String} [config.iamEndpoint]
     * @param {String} [config.evciEndpoint]
     * @param {String} [config.oauthEndpoint]
     * @param {String} [config.oauthClientId]
     * @param {String} [config.oauthSecret]
     * @return {CorbelDriver}
     */
    corbel.getDriver = function(config) {
        config = config || {};

        return new CorbelDriver(config);
    };


})();
