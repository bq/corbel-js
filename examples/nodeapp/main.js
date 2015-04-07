'use strict';
var corbel = require('../../dist/corbel.js');

var CONFIG = {
    clientId: 'a9fb0e79',
    clientSecret: '90f6ed907ce7e2426e51aa52a18470195f4eb04725beb41569db3f796a018dbd',
    scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

    urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
};

var cd = corbel.getDriver(CONFIG);

cd.iam.token().create().then(function() {
	console.log('ok');
}).catch(function() {
	console.log('error');
});
