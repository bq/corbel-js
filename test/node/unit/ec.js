'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In EC module', function() {

    var sandbox = sinon.sandbox.create();
    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        urlBase: 'https://{{module}}-corbel.io/'

    };

    var PRODUCT_EC_URL = CONFIG.urlBase.replace('{{module}}', 'ec') + 'product';

    var corbelDriver = corbel.getDriver(CONFIG);

    var corbelRequestStub;

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });
    describe('with product,', function() {
        it('create one', function() {
            corbelRequestStub.returns(Promise.resolve());
            var productData = '{\'test_object\':\'test\'}';
            corbelDriver.ec.product().create(productData);

            var callRequestParam = corbelRequestStub.getCall(0).args[0];
            expect(callRequestParam.url).to.be.equal(PRODUCT_EC_URL);
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data).to.be.equal(productData);
        });

        it('get one', function() {
            corbelRequestStub.returns(Promise.resolve('OK'));

            corbelDriver.ec.product('idProduct').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.include(PRODUCT_EC_URL);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('get all with params', function() {
            corbelRequestStub.returns(Promise.resolve('OK'));
            var params = {
                query: [{
                    '$eq': {
                        field: 'value'
                    }
                }],
                pagination: {
                    size: 2,
                    page: 3
                },
                sort: {
                    field: 'asc'
                }
            };

            corbelDriver.ec.product().get(params);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.include(PRODUCT_EC_URL);
            expect(callRequestParam.method).to.be.equal('GET');
            console.log(callRequestParam);
            expect(callRequestParam.url).to.contain('api:query=[{"$eq":{"field":"value"}}]&api:sort={"field":"asc"}&api:page=3&api:pageSize=2');
        });

        it('update one', function() {
            corbelRequestStub.returns(Promise.resolve(204));
            var productDataUpdate = '{\'test_object\':\'testUpdate\'}';
            var idProduct = 1;

            corbelDriver.ec.product(idProduct).update(productDataUpdate);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(PRODUCT_EC_URL + '/1');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(callRequestParam.data).to.be.equal(productDataUpdate);

        });

        it('delete one', function() {
            corbelRequestStub.returns(Promise.resolve(204));
            var idProduct = 1;

            corbelDriver.ec.product(idProduct).delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(PRODUCT_EC_URL + '/1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });
    });
});
