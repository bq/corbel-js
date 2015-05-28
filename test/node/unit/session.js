'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  sinon = require('sinon'),
  _ = require('underscore'),
  expect = chai.expect;



describe('In Session module', function() {

  var sandbox = sinon.sandbox.create(),
    CONFIG = {
      clientId: 'a9fb0e79',
      clientSecret: '90f6ed907ce7e2426e51aa52a18470195f4eb04725beb41569db3f796a018dbd',

      scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

      urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
    },
    corbelDriver = corbel.getDriver(CONFIG),
    session = corbelDriver.session,
    localStorage = session.localStorage,
    sessionStorage = localStorage;

  beforeEach(function() {
    session = corbel.Session.create(corbelDriver);
  });

  afterEach(function() {
    session.destroy();
    sandbox.restore();
  });

  it('exists and is an object', function() {
    expect(session).to.be.an('object');
  });

  it('has all namespace properties', function() {

    expect(session).to.respondTo('gatekeeper');
    expect(session).to.respondTo('exist');
    expect(session).to.respondTo('logged');
    expect(session).to.respondTo('get');
    expect(session).to.respondTo('remove');
    expect(session).to.respondTo('isPersistent');
    expect(session).to.respondTo('setPersistent');
    expect(session).to.respondTo('persist');
    expect(session).to.respondTo('destroy');

  });

  describe('session.exist()', function() {

    it('return true when user is logged', function() {
      session.logged({
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expiresAt: 1,
        oauthService: 'oauth',
        user: 'user'
      });
      expect(session.exist()).to.be.equal(true);
    });

    it('return false when user is not logged', function() {
      expect(session.exist()).to.be.equal(false);
    });
  });

  it('stores data in localStorage when session is persistent', function() {
    session.logged({
      accessToken: 'token',
      refreshToken: 'refreshToken',
      expiresAt: 1,
      oauthService: 'oauth',
      user: 'user',
      persistent: true
    });
    expect(localStorage.getItem('accessToken')).to.be.equal('token');
  });

  it('remove session param correctly', function() {

    session.add('customVar', true);
    expect(session.get('customVar')).to.be.equal(true);

    var spy = sandbox.spy(session, 'add');
    session.remove('customVar');
    expect(spy.calledOnce).to.be.equal(true);
    expect(session.get('customVar')).to.be.equal(null);

  });

  describe('when destroy', function() {

    it('removes all data correctly', function() {
      session.logged({
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expiresAt: 1,
        oauthService: 'oauth',
        user: 'user',
        persistent: false
      });
      session.destroy();
      expect(localStorage.getItem('persistent')).to.be.equal(null);
      expect(sessionStorage.getItem('accessToken')).to.be.equal(null);
      expect(localStorage.getItem('accessToken')).to.be.equal(null);
      //TODO review if storage folders are removed
    });

  });

  it('accessToken, refreshToken, expiresAt, user are mandatory', function() {

    var sessionSetter = function(params) {
      return function() {
        return session.logged(params);
      };
    };

    // Complete params
    var params = {
      accessToken: 'token',
      refreshToken: 'refreshToken',
      expiresAt: 1,
      oauthService: 'oauth',
      loginBasic: true,
      user: 'user',
      persistent: false
    };

    expect(sessionSetter(_.omit(params, 'accessToken'))).to.throw('Missing accessToken');
    expect(sessionSetter(_.omit(params, 'refreshToken'))).to.throw('Missing refreshToken');
    expect(sessionSetter(_.omit(params, 'expiresAt'))).to.throw('Missing expiresAt');
    expect(sessionSetter(_.omit(_.omit(params, 'oauthService'), 'loginBasic'))).to.throw('Missing oauthService and loginBasic');
    expect(sessionSetter(_.omit(params, 'user'))).to.throw('Missing user');

    expect(sessionSetter(_.omit(params, 'oauthService'))).to.not.throw('Missing oauthService and loginBasic');
    expect(sessionSetter(_.omit(params, 'loginBasic'))).to.not.throw('Missing oauthService and loginBasic');
  });

  describe('set/get simple values', function() {

    it('with non persistent session', function() {
      session.logged({
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expiresAt: 1,
        oauthService: 'oauth',
        user: 'user',
        persistent: false
      });

      session.add('string', 'value');
      session.add('boolean', true);
      session.add('number', 3);
      expect(session.get('string')).to.be.an('string');
      expect(session.get('string')).to.be.equal('value');

      expect(session.get('boolean')).to.be.an('boolean');
      expect(session.get('boolean')).to.be.equal(true);

      expect(session.get('number')).to.be.an('number');
      expect(session.get('number')).to.be.equal(3);
    });

    it('with persistent session', function() {
      session.logged({
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expiresAt: 1,
        oauthService: 'oauth',
        user: 'user',
        persistent: true
      });

      session.add('string', 'value');
      session.add('boolean', true);
      session.add('number', 3);
      expect(session.get('string')).to.be.an('string');
      expect(session.get('string')).to.be.equal('value');

      expect(session.get('boolean')).to.be.an('boolean');
      expect(session.get('boolean')).to.be.equal(true);

      expect(session.get('number')).to.be.an('number');
      expect(session.get('number')).to.be.equal(3);
    });

  });

  describe('set/get object values', function() {

    it('with non persistent session', function() {
      session.logged({
        accessToken: 'token',
        refreshToken: 'refreshToken',
        expiresAt: 1,
        oauthService: 'oauth',
        user: 'user',
        persistent: false
      });

      session.add('object', {
        key: 'value'
      });
      expect(session.get('object')).to.be.an('object');
      expect(session.get('object').key).to.be.equal('value');
    });

    describe('with persistent session', function() {

      it('session created correctly', function() {
        session.logged({
          accessToken: 'token',
          refreshToken: 'refreshToken',
          expiresAt: 1,
          oauthService: 'oauth',
          user: 'user',
          persistent: true
        });

        session.add('object', {
          key: 'value'
        });
        expect(session.get('object')).to.be.an('object');
        expect(session.get('object').key).to.be.equal('value');
      });

    });

  });


});
