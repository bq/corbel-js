'use strict';

(function($, corbel) {

    var CONFIG = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
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
        return cd.resources.collection(COLLECTION_NAME_CRUD).add(TEST_OBJECT);
        //return cd.resources.resource(COLLECTION_NAME_CRUD, 'id').update(TEST_OBJECT);

    }).then(function(response) {
        console.log('ok', response);
    }).catch(function(error) {
        console.log('error', error);
    });

})(window.$, window.corbel);
