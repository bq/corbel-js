'use strict';

(function($, corbel) {

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

    cd.iam.token().create().then(function(response) {
        console.log('token.response', response);

        var COLLECTION_NAME_CRUD = 'test:CoreJSObjectCrud' + Date.now();
        var TEST_OBJECT = {
            test: 'test',
            test2: 'test2',
            test3: 1,
            test4: 1.3,
            test5: {
                t1: 1.3,
                t2: [1, 2, 3.3]
            }
        };
        return cd.resources.collection(COLLECTION_NAME_CRUD).add('application/json', TEST_OBJECT);
        //return cd.resources.resource(COLLECTION_NAME_CRUD, 'id').update('application/json', TEST_OBJECT);

    }).then(function(response) {
        console.log('ok', response);
    }).catch(function(error) {
        console.log('error', error);
    });

})(window.$, window.corbel);
