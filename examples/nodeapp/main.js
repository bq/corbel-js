'use strict';
var corbel = require('../../dist/corbel.js');

var CONFIG = {
    urlBase: 'url',

    clientId: 'a9fb0e79',
    clientSecret: '90f6ed907ce7e2426e51aa52a18470195f4eb04725beb41569db3f796a018dbd',
    scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',
    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
    ecEndpoint: 'https://ec-qa.bqws.io/v1.0/',
    assetsEndpoint: 'https://assets-qa.bqws.io/v1.0/',
    notificationsEndpoint: 'https://notifications-qa.bqws.io/v1.0/',
    bqponEndpoint: 'https://bqpon-qa.bqws.io/v1.0/',
    webfsEndpoint: 'https://webfs-qa.bqws.io/v1.0/',
    schedulerEndpoint: 'https://scheduler-qa.bqws.io/v1.0/',
    borrowEndpoint: 'https://borrow-qa.bqws.io/v1.0/'
};

var cd = corbel.getDriver(CONFIG);

cd.iam.token().create().then(function() {
	console.log('ok');
}).catch(function() {
	console.log('error');
});
