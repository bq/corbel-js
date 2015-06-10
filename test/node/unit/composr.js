'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect;

describe('corbel compoSR module', function() {

  var sandbox = sinon.sandbox.create();
  var CONFIG = {

    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopes: ['silkroad-qa:client'],

    urlBase: 'https://{{module}}-corbel.io/'

  };

  var COMPOSR_END_POINT = CONFIG.urlBase.replace('{{module}}', 'composr');

  var corbelDriver = corbel.getDriver(CONFIG);

  var corbelRequestStub;
  var composr;

  beforeEach(function() {
    corbelDriver = corbel.getDriver(CONFIG);
    composr = corbelDriver.composr;
    corbelRequestStub = sandbox.stub(corbel.request, 'send').returns(Promise.resolve());

    this.payload = {
      headers: '',
      body: '',
      data: '',
      queryParams: '',
    };

  });

  afterEach(function() {
    sandbox.restore();
  });



  describe('With compoSR module', function() {

    describe('request', function() {
      it('the client can do request to some phrase with POST method', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        this.payload.body = {
          att: 1,
          att2: 'stringValue'
        };

        composr.request('phrase/Id').post(this.payload);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/Id');
        expect(paramsReceived.method).to.be.equal('POST');
        expect(paramsReceived.data).to.be.equal(JSON.stringify(this.payload.body));
      });

      it('the client can do request to some phrase with POST method, path and query params', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        this.payload.body = {
          att: 1,
          att2: 'stringValue'
        };

        this.payload.queryParams = {
          att: 1
        };

        composr.request('phrase/Id','param1','param2').post(this.payload);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/Id/param1/param2?att=1');
        expect(paramsReceived.method).to.be.equal('POST');
        expect(paramsReceived.data).to.be.equal(JSON.stringify(this.payload.body));
      });

      it('the client can do request to some phrase with GET method', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        composr.request('phrase/Id?att=1&att2="stringValue"').get(this.payload);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/Id?att=1&att2="stringValue"');
        expect(paramsReceived.method).to.be.equal('GET');
      });

      it('the client can do request to some phrase with PUT method', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        this.payload.body = {
          att: 1,
          att2: 'stringValue'
        };

        composr.request('phrase/Id').put(this.payload);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/Id');
        expect(paramsReceived.method).to.be.equal('PUT');
        expect(paramsReceived.data).to.be.equal(JSON.stringify(this.payload.body));
      });

      it('the client can do request to some phrase with DELETE method', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        composr.request('phrase/Id').delete(this.payload);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/Id');
        expect(paramsReceived.method).to.be.equal('DELETE');
      });


    });

    describe('phrases', function() {
      it('its possible add phrases', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        var phrase = {
          id: 'id',
          method: 'GET',
          code: 'test code',
          url: 'http//:test'
        };

        composr.phrase().put(phrase);

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase');
        expect(paramsReceived.method).to.be.equal('PUT');
        expect(paramsReceived.data).to.be.equal(JSON.stringify(phrase));
      });

      it('its possible get phrases', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        composr.phrase('phrase/Id').get();

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/phrase/Id');
        expect(paramsReceived.method).to.be.equal('GET');
      });

      it('its possible get all phrases by domain', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        composr.phrase().getAll();

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase');
        expect(paramsReceived.method).to.be.equal('GET');
      });

      it('its possible delete phrases', function() {
        corbelRequestStub.returns(Promise.resolve('OK'));

        composr.phrase('phrase/Id').delete();

        var paramsReceived = corbel.request.send.firstCall.args[0];
        expect(paramsReceived.url).to.be.equal(COMPOSR_END_POINT + 'phrase/phrase/Id');
        expect(paramsReceived.method).to.be.equal('DELETE');
      });
    });


  });


});
