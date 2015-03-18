//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    function CorbelDriver(config) {
        // create isntance config
        this.config = corbel.Config.create(config);

        // create isntance modules with injected driver
        this.iam = corbel.Iam.create(this);
        this.resources = corbel.Resources.create(this);
    }

    corbel.CorbelDriver = CorbelDriver;

    corbel.getDriver = function(config) {
        config = config || {};

        var keys = [
            'urlBase',
            'clientId',
            'clientSecret',
            'scopesApp',
            'scopesUserLogin',
            'scopesUserCreate',
            'resourcesEndpoint',
            'iamEndpoint',
            'evciEndpoint',
            'oauthEndpoint',
            'oauthClientId',
            'oauthSecret'
        ];

        keys.forEach(function(key) {
            if (!config[key]) {
                throw new Error('undefined:' + key);
            }
        });

        return new CorbelDriver(config);
    };


})();