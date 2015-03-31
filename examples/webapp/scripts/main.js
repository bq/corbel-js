'use strict';

(function($, corbel) {

    var CONFIG = {
        urlBase: 'url',

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

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
