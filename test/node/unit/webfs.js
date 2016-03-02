'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In Webfs module we can', function() {

    var sandbox = sinon.sandbox.create();
    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        domain: 'domain-example',
        
        urlBase: 'https://{{module}}-corbel.io/v1.0/'
    };

    var WEBFS_URL = CONFIG.urlBase.replace('{{module}}', 'webfs') + CONFIG.domain + '/';
    var RESOURCE_ID = 'index.html';

    var corbelDriver = corbel.getDriver(CONFIG);

    var corbelRequestStub;

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('retrieve a resource from S3', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.webfs.webfs(RESOURCE_ID).get();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam).to.have.property('url', WEBFS_URL + RESOURCE_ID);
        expect(callRequestParam).to.have.property('method', 'GET');
    });

    it('retrieve a resource from S3 with specific contentType', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.webfs.webfs(RESOURCE_ID).get({contentType: 'text/xml'});

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam).to.have.property('url', WEBFS_URL + RESOURCE_ID);
        expect(callRequestParam).to.have.property('method', 'GET');
        expect(callRequestParam).to.have.property('contentType', 'text/xml');
    });

    it('retrieve a resource from S3 with specific Accept header', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.webfs.webfs(RESOURCE_ID).get({Accept: 'text/xml'});

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam).to.have.property('url', WEBFS_URL + RESOURCE_ID);
        expect(callRequestParam).to.have.property('method', 'GET');
        expect(callRequestParam).to.have.deep.property('headers.Accept', 'text/xml');
    });

    it('an error is thrown if resourceId is undefined', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        expect(function() {
            corbelDriver.webfs.webfs().get();
        }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete a folder from S3', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.webfs.webfs(RESOURCE_ID).delete();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam).to.have.property('url', WEBFS_URL + RESOURCE_ID);
        expect(callRequestParam).to.have.property('method', 'DELETE');
    });
});
