'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In Notifications module we can', function() {

    var sandbox = sinon.sandbox.create();

    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',
        domain: 'domain-example',
        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        urlBase: 'https://{{module}}-corbel.io/'

    };

    var MODULE_URL = CONFIG.urlBase.replace('{{module}}', 'notifications');

    var corbelRequestStub;

    var corbelDriver = corbel.getDriver(CONFIG);

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('create notification template', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';
        corbelDriver.notifications.template().create(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/notification');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('create notification template in a custom domain', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';
        corbelDriver.domain('customDomain').notifications.template().create(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + 'customDomain' + '/notification');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('get notification template', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;

        corbelDriver.notifications.template(idNotification).get();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/notification' + '/1');
        expect(paramsRecived.method).to.be.equal('GET');
    });

    it('get all notifications template with params', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var params = {
            query: [{
                '$eq': {
                    type: 'mail'
                }
            }],
            pagination: {
                page: 1,
                pageSize: 2
            },
            sort: {
                field: 'asc'
            }
        };

        corbelDriver.notifications.template().get(params);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        var url = paramsRecived.url.split('?');
        expect(url).to.be.include(MODULE_URL + CONFIG.domain + '/notification');
        expect(url).to.be.include('api:query=' + encodeURIComponent('[{"$eq":{"type":"mail"}}]') + '&api:sort=' + encodeURIComponent('{"field":"asc"}') + '&api:page=1&api:pageSize=2');
        expect(paramsRecived.method).to.be.equal('GET');
    });

    it('update notification template', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';

        corbelDriver.notifications.template(idNotification).update(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/notification' +'/1');
        expect(paramsRecived.method).to.be.equal('PUT');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('update notification template without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.notifications.template().update({});
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete notification template', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;

        corbelDriver.notifications.template(idNotification).delete();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/notification' +'/1');
        expect(paramsRecived.method).to.be.equal('DELETE');
    });

    it('delete notification template without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.notifications.template().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('send notification', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';
        corbelDriver.notifications.notification().send(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/notification/send');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('create notification domain', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationDomainData = '{\'properties\':{\'prop1\':\'propValue1\'},\'templates\':{\'temp1\': \'tempValue1\'}}';
        corbelDriver.notifications.domain().create(notificationDomainData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/domain');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationDomainData);
    });

    it('create notification domain with custom domain', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationDomainData = '{\'properties\':{\'prop1\':\'propValue1\'},\'templates\':{\'temp1\': \'tempValue1\'}}';
        corbelDriver.domain('customDomain').notifications.domain().create(notificationDomainData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + 'customDomain/domain');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationDomainData);
    });

    it('get notification domain', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.notifications.domain().get();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/domain');
        expect(paramsRecived.method).to.be.equal('GET');
    });

    it('update notification domain', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var notificationDomainData = '{\'properties\':{\'prop1\':\'propValue1\'}}';

        corbelDriver.notifications.domain().update(notificationDomainData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/domain');
        expect(paramsRecived.method).to.be.equal('PUT');
        expect(paramsRecived.data).to.be.equal(notificationDomainData);
    });

    it('delete notification domain', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        corbelDriver.notifications.domain().delete();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(MODULE_URL + CONFIG.domain + '/domain');
        expect(paramsRecived.method).to.be.equal('DELETE');
    });

});
