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

    corbel.getDriver = function(config) {
        config = config || {};

        // var keys = [
        //     'urlBase',
        //     'clientId',
        //     'clientSecret',
        //     'scopesApp',
        //     'scopesUserLogin',
        //     'scopesUserCreate',
        //     'resourcesEndpoint',
        //     'iamEndpoint',
        //     'evciEndpoint',
        //     'oauthEndpoint',
        //     'oauthClientId',
        //     'oauthSecret'
        // ];

        // keys.forEach(function(key) {
        //     if (!config[key]) {
        //         throw new Error('undefined:' + key);
        //     }
        // });

        return new CorbelDriver(config);
    };


})();