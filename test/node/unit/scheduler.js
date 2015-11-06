'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In Scheduler module we can', function() {

    var sandbox = sinon.sandbox.create();

    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        urlBase: 'https://{{module}}-corbel.io/'

    };
    
    var TASK_ID = 'task:id';

    var TASK_DATA = { 'data': 'data' };

    var SCHEDULER_URL = CONFIG.urlBase.replace('{{module}}', corbel.Scheduler.moduleName) + 'tasks';

    var corbelDriver = corbel.getDriver(CONFIG);

    var corbelRequestStub;

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('generate a scheduler task correctly', function() {
        corbelRequestStub.returns(Promise.resolve());
        corbelDriver.scheduler.task().create(TASK_DATA);

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(SCHEDULER_URL);
        expect(callRequestParam.method).to.be.equal('POST');
        expect(callRequestParam.data).to.be.equal(TASK_DATA);
    });

    it('task cannot be retrieved without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.scheduler.task().get();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('retrieve a scheduler task correctly', function() {
        corbelRequestStub.returns(Promise.resolve());
        corbelDriver.scheduler.task(TASK_ID).get();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(SCHEDULER_URL +'/'+ TASK_ID);
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('task cannot be updated without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.scheduler.task().update();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('update a scheduler task correctly', function() {
        corbelRequestStub.returns(Promise.resolve());
        corbelDriver.scheduler.task(TASK_ID).update(TASK_DATA);

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(SCHEDULER_URL +'/'+ TASK_ID);
        expect(callRequestParam.method).to.be.equal('PUT');
    });

    it('task cannot be delete without an id', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function(){
        corbelDriver.scheduler.task().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete a scheduler task correctly', function() {
        corbelRequestStub.returns(Promise.resolve());
        corbelDriver.scheduler.task(TASK_ID).delete();

        var callRequestParam = corbelRequestStub.getCall(0).args[0];
        expect(callRequestParam.url).to.be.equal(SCHEDULER_URL +'/'+ TASK_ID);
        expect(callRequestParam.method).to.be.equal('DELETE');
    });
});
