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

  var EC_URL = CONFIG.urlBase.replace('{{module}}', corbel.Ec.moduleName);

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
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product');
      expect(callRequestParam.method).to.be.equal('POST');
      expect(callRequestParam.data).to.be.equal(productData);
    });

    it('get one', function() {
      corbelRequestStub.returns(Promise.resolve('OK'));

      corbelDriver.ec.product('idProduct').get();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'product');
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
          pageSize: 2,
          page: 3
        },
        sort: {
          field: 'asc'
        }
      };

      corbelDriver.ec.product().get(params);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(decodeURIComponent(callRequestParam.url)).to.be.include(EC_URL + 'product');
      expect(callRequestParam.method).to.be.equal('GET');
      console.log(callRequestParam);
      expect(decodeURIComponent(callRequestParam.url)).to.contain('api:query=[{"$eq":{"field":"value"}}]&api:sort={"field":"asc"}&api:page=3&api:pageSize=2');
    });

    it('update one', function() {
      corbelRequestStub.returns(Promise.resolve(204));
      var productDataUpdate = '{\'test_object\':\'testUpdate\'}';
      var idProduct = 1;

      corbelDriver.ec.product(idProduct).update(productDataUpdate);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product' + '/1');
      expect(callRequestParam.method).to.be.equal('PUT');
      expect(callRequestParam.data).to.be.equal(productDataUpdate);
    });

    it('delete one', function() {
      corbelRequestStub.returns(Promise.resolve(204));
      var idProduct = 1;

      corbelDriver.ec.product(idProduct).delete();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product' + '/1');
      expect(callRequestParam.method).to.be.equal('DELETE');
    });

  });

  describe('with order,', function() {

    it('get one', function(done) {
      corbelRequestStub.returns(Promise.resolve('ok'));
      var idOrder = 1;
      var response = corbelDriver.ec.order(idOrder).get();
      expect(response).be.eventually.fulfilled
        .then(function(response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('GET');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('update one', function(done) {
      corbelRequestStub.returns(Promise.resolve(204));
      var productDataUpdate = '{\'test_object\':\'testUpdate\'}';
      var idOrder = 1;

      var response = corbelDriver.ec.order(idOrder).update(productDataUpdate);
      expect(response).be.eventually.fulfilled
        .then(function(response) {
          expect(response).to.be.equal(204);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('PUT');
          expect(paramsRecived.data).to.be.equal(productDataUpdate);
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('delete one', function(done) {
      corbelRequestStub.returns(Promise.resolve(204));
      var idOrder = 1;

      var response = corbelDriver.ec.order(idOrder).delete();
      expect(response).be.eventually.fulfilled
        .then(function(response) {
          expect(response).to.be.equal(204);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('DELETE');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('checkout', function() {
      corbelRequestStub.returns(Promise.resolve());
      var checkoutData = {
        paymentMethodIds: ['paymentMethod']
      };
      corbelDriver.ec.order('orderId').checkout(checkoutData);

      var paramsRecived = corbel.request.send.firstCall.args[0];
      expect(paramsRecived.url).to.be.equal(EC_URL + 'order/orderId/checkout');
      expect(paramsRecived.method).to.be.equal('POST');
      expect(paramsRecived.data).to.be.equal(checkoutData);
    });

    it('checkout failed with empty payment methods', function(done) {
      corbelRequestStub.returns(Promise.resolve(202));
      var checkoutData = {
        paymentMethodIds: []
      };

      expect(corbelDriver.ec.order('orderId').checkout(checkoutData)).be.eventually.rejected
        .then(function(response) {
          expect(response.message).to.be.equal('One payment method is needed at least');
        }).should.be.eventually.fulfilled
        .and.notify(done);
    });

    it('prepare', function(done) {
      corbelRequestStub.returns(Promise.resolve(200));

      var response = corbelDriver.ec.order('orderId').prepare();
      expect(response).be.eventually.fulfilled
        .then(function(response) {
          expect(response).to.be.equal(200);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/orderId/prepare');
          expect(paramsRecived.method).to.be.equal('POST');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

  });

});
