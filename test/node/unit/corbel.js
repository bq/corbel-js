'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect;

describe('in corbel module', function() {

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
        expect(corbel.getDriver({
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          scopes: 'scopesApp',

          urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
        })).to.be.an.instanceof(corbel.CorbelDriver);
      });

    });

    describe('with a CorbelDriver instance', function() {

      var corbelDriver;

      beforeEach(function() {
        corbelDriver = corbel.getDriver({
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          scopes: 'scopesApp',

          urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
        });
      });

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

    var corbelDriver = corbel.getDriver({
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      scopes: 'scopesApp',

      urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
    });

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

});
