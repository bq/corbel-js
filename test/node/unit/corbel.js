'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect;


describe('in corbel module', function() {

  var sandbox = sinon.sandbox.create();
  var corbelDriver;

  function createDriver() {
    return corbel.getDriver({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      scopes: 'scopesApp',

      urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
    });
  }

  beforeEach(function() {
    corbelDriver = createDriver();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('is defined and is an object', function() {
    expect(corbel).to.be.an('object');
  });

  it('expected methods are available', function() {
    expect(corbel).to.respondTo('getDriver');
  });

  it('expected static modules are available', function() {
    expect(corbel).to.have.ownProperty('jwt');
    expect(corbel).to.have.ownProperty('request');
    expect(corbel).to.have.ownProperty('utils');
    expect(corbel).to.have.ownProperty('cryptography');
  });

  describe('when generating a new driver', function() {

    it('urlBase is required', function() {
      expect(function() {
        corbel.getDriver({
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          scopes: 'scopesApp'
        });
      }).to.throw('error:undefined:urlbase');
    });

    describe('with all parametes', function() {

      it('it creates a CorbelDriver', function() {
        expect(corbelDriver).to.be.an.instanceof(corbel.CorbelDriver);
      });

    });

    describe('with a CorbelDriver instance', function() {

      it('has all members', function() {
        expect(corbelDriver).to.have.ownProperty('config');
        expect(corbelDriver).to.have.property('clone');
        expect(corbelDriver.config).to.be.an.instanceof(corbel.Config);
        expect(corbelDriver.iam).to.be.an.instanceof(corbel.Iam);
        expect(corbel).to.have.ownProperty('Iam');
      });

    });

  });

  it('can clone a new driver with the same config', function() {

    var clonedDriver = corbelDriver.clone();
    expect(clonedDriver !== corbelDriver).to.be.equal(true);

    var driverConfig = corbelDriver.config.getConfig();
    var clonedConfig = clonedDriver.config.getConfig();

    expect(driverConfig !== clonedConfig).to.be.equal(true);
    expect(driverConfig.clientId).to.be.equal(clonedConfig.clientId);
    expect(driverConfig.clientSecret).to.be.equal(clonedConfig.clientSecret);
    expect(driverConfig.scopes).to.be.equal(clonedConfig.scopes);
    expect(driverConfig.urlBase).to.be.equal(clonedConfig.urlBase);

  });

  it('can clone a new driver with the same guid', function() {

    var clonedDriver = corbelDriver.clone();
    expect(clonedDriver !== corbelDriver).to.be.equal(true);

    expect(clonedDriver.guid).to.equals(corbelDriver.guid);
  });

  describe('Event system', function() {

    it('can register new handler', function() {

      var stub = sandbox.stub();

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
      corbelDriver.addEventListener('custom:event:name', stub);

      expect(corbelDriver._events['custom:event:name'].length).to.be.equal(1);

      corbelDriver.dispatch('custom:event:name', {
        params: true
      });

      expect(stub.calledOnce).to.be.equal(true);
      expect(stub.getCall(0).args[0]).to.be.an('object');
      expect(stub.getCall(0).args[0].params).to.be.equal(true);

    });

    it('is cloned by the clone function', function() {

      var stub = sandbox.stub();

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
      corbelDriver.addEventListener('custom:event:name', stub);

      expect(corbelDriver._events['custom:event:name'].length).to.be.equal(1);

      var clonedDriver = corbelDriver.clone();
      expect(clonedDriver._events['custom:event:name'].length).to.be.equal(1);

      corbelDriver.dispatch('custom:event:name', true);

      expect(stub.calledOnce).to.be.equal(true);

      clonedDriver.dispatch('custom:event:name', true);

      expect(stub.calledTwice).to.be.equal(true);
    });

    it('register same handler once', function() {

      var stub = sandbox.stub();

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
      corbelDriver.addEventListener('custom:event:name', stub);
      corbelDriver.addEventListener('custom:event:name', stub);
      corbelDriver.addEventListener('custom:event:name', stub);

      expect(corbelDriver._events['custom:event:name'].length).to.be.equal(1);

      corbelDriver.dispatch('custom:event:name', {
        params: true
      });

      expect(stub.calledOnce).to.be.equal(true);
      expect(stub.getCall(0).args[0]).to.be.an('object');
      expect(stub.getCall(0).args[0].params).to.be.equal(true);

    });

    it('can remove a handler', function() {

      var stub = sandbox.stub();

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
      corbelDriver.addEventListener('custom:event:name', stub);
      corbelDriver.removeEventListener('custom:event:name', stub);

      expect(corbelDriver._events['custom:event:name'].length).to.be.equal(0);

      corbelDriver.dispatch('custom:event:name', {
        params: true
      });

      expect(stub.callCount).to.be.equal(0);

    });

    it('can remove a non existing handler', function() {

      var stub = sandbox.stub();

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
      corbelDriver.removeEventListener('custom:event:name', stub);

      expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);

    });

    describe('trigger an event', function() {

      it('fires handlers as expected', function() {

        var stub = sandbox.stub();

        expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
        corbelDriver.addEventListener('custom:event:name', stub);

        expect(corbelDriver._events['custom:event:name'].length).to.be.equal(1);

        corbelDriver.dispatch('custom:event:name', {
          params: true
        });

        expect(stub.calledOnce).to.be.equal(true);
        expect(stub.getCall(0).args[0]).to.be.an('object');
        expect(stub.getCall(0).args[0].params).to.be.equal(true);

      });

      it('fires handlers only once', function() {

        var stub = sandbox.stub();
        var stub2 = sandbox.stub();

        expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
        corbelDriver.addEventListener('custom:event:name', stub);
        corbelDriver.addEventListener('custom:event:name', stub);
        corbelDriver.addEventListener('custom:event:name', stub2);
        corbelDriver.addEventListener('custom:event:name', stub2);
        corbelDriver.removeEventListener('custom:event:name', stub);
        corbelDriver.addEventListener('custom:event:name', stub);

        expect(corbelDriver._events['custom:event:name'].length).to.be.equal(2);

        corbelDriver.dispatch('custom:event:name', {
          params: true
        });

        expect(stub.calledOnce).to.be.equal(true);
        expect(stub2.calledOnce).to.be.equal(true);
        expect(stub.getCall(0).args[0]).to.be.an('object');
        expect(stub.getCall(0).args[0].params).to.be.equal(true);

        expect(stub2.getCall(0).args[0]).to.be.an('object');
        expect(stub2.getCall(0).args[0].params).to.be.equal(true);

      });

      it('do not fires removed handlers', function() {

        var stub = sandbox.stub();
        var stub2 = sandbox.stub();

        expect(corbelDriver._events['custom:event:name']).to.be.equal(undefined);
        corbelDriver.addEventListener('custom:event:name', stub);
        corbelDriver.addEventListener('custom:event:name', stub2);
        corbelDriver.removeEventListener('custom:event:name', stub);

        expect(corbelDriver._events['custom:event:name'].length).to.be.equal(1);

        corbelDriver.dispatch('custom:event:name', {
          params: true
        });

        expect(stub.callCount).to.be.equal(0);
        expect(stub2.callCount).to.be.equal(1);

      });

    });

  });

});
