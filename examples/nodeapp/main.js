'use strict';
var corbel = require('../../dist/corbel.js');

var CONFIG = {
    urlBase: 'url',

    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopesApp: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],
    scopesUserLogin: 'silkroad-qa:user',
    scopesUserCreate: 'silkroad-qa:user',

    oauthEndpoint: 'https://oauth.io/',
    resourcesEndpoint: 'https://resources.io/',
    iamEndpoint: 'https://iam.io/',
    evciEndpoint: 'https://evci.io/',
    ecEndpoint: 'https://ec.io/',
    assetsEndpoint: 'https://assets.io/',
    notificationsEndpoint: 'https://notifications.io/',
    bqponEndpoint: 'https://bqpon.io/',
    webfsEndpoint: 'https://webfs.io/',
    schedulerEndpoint: 'https://scheduler.io/',
    borrowEndpoint: 'https://borrow.io/',

    oauthClientId: 'silkroadClient',
    oauthSecret: 'silkroadSecret'
};

var cd = corbel.getDriver(CONFIG);

cd.iam.token().create().then(function() {
	console.log('ok');
}).catch(function() {
	console.log('error');
});
