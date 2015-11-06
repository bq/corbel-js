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

        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        urlBase: 'https://{{module}}-corbel.io/'

    };

    var NOTIFICATION_URL = CONFIG.urlBase.replace('{{module}}', 'notifications') + 'notification';

    var corbelRequestStub;

    var corbelDriver = corbel.getDriver(CONFIG);

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('create notification', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';
        corbelDriver.notifications.notification().create(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(NOTIFICATION_URL);
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('get notification', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;

        corbelDriver.notifications.notification(idNotification).get();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(NOTIFICATION_URL +'/1');
        expect(paramsRecived.method).to.be.equal('GET');
    });

    it('get all with params', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var params = {
            query: [{
                '$eq': {
                    type: 'mail'
                }
            }],
            page: {
                size: 2,
                page: 3
            },
            sort: {
                field: 'asc'
            }
        };

        corbelDriver.notifications.notification().get(params);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        var url = paramsRecived.url.split('?');
        expect(url).to.be.include(NOTIFICATION_URL);
        expect(url).to.be.include('api:query=[{"$eq":{"type":"mail"}}]&api:sort={"field":"asc"}');
        expect(paramsRecived.method).to.be.equal('GET');
    });

    it('update notification', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';

        corbelDriver.notifications.notification(idNotification).update(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(NOTIFICATION_URL +'/1');
        expect(paramsRecived.method).to.be.equal('PUT');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });

    it('update notification without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.notifications.notification().update({});
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete notification', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));
        var idNotification = 1;

        corbelDriver.notifications.notification(idNotification).delete();

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(NOTIFICATION_URL +'/1');
        expect(paramsRecived.method).to.be.equal('DELETE');
    });

    it('delete notification without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.notifications.notification().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('send notification', function() {
        corbelRequestStub.returns(Promise.resolve());
        var notificationData = '{\'id\':\'OAuth:mail:resetPass\',\'type\':\'mail\', }';
        corbelDriver.notifications.notification().sendNotification(notificationData);

        var paramsRecived = corbelRequestStub.getCall(0).args[0];
        expect(paramsRecived.url).to.be.equal(NOTIFICATION_URL + '/send');
        expect(paramsRecived.method).to.be.equal('POST');
        expect(paramsRecived.data).to.be.equal(notificationData);
    });
});
