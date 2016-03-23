'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  sinon = require('sinon'),
  _ = require('lodash'),
  expect = chai.expect;

describe('In EC module', function () {

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

  beforeEach(function () {
    corbelRequestStub = sandbox.stub(corbel.request, 'send');
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('with product,', function () {

    it('create one', function () {
      corbelRequestStub.returns(Promise.resolve());
      var productData = '{\'test_object\':\'test\'}';
      corbelDriver.ec.product().create(_.cloneDeep(productData));

      var callRequestParam = corbelRequestStub.getCall(0).args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product');
      expect(callRequestParam.method).to.be.equal('POST');
      expect(callRequestParam.data).to.be.equal(productData);
    });

    it('get one', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));

      corbelDriver.ec.product('idProduct').get();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'product');
      expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get all with params', function () {
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

      corbelDriver.ec.product().getAll(params);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'product');
      expect(callRequestParam.method).to.be.equal('GET');
      expect(callRequestParam.url).to.contain('api:query=' + encodeURIComponent('[{"$eq":{"field":"value"}}]') + '&api:sort=' + encodeURIComponent('{"field":"asc"}') + '&api:page=3&api:pageSize=2');
    });

    it('update one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.product().update({});
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('update one', function () {
      corbelRequestStub.returns(Promise.resolve(204));
      var productDataUpdate = '{\'test_object\':\'testUpdate\'}';
      var idProduct = 1;

      corbelDriver.ec.product(idProduct).update(_.cloneDeep(productDataUpdate));

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product' + '/1');
      expect(callRequestParam.method).to.be.equal('PUT');
      expect(callRequestParam.data).to.be.equal(productDataUpdate);
    });

    it('delete one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.product().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete one', function () {
      corbelRequestStub.returns(Promise.resolve(204));
      var idProduct = 1;

      corbelDriver.ec.product(idProduct).delete();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'product' + '/1');
      expect(callRequestParam.method).to.be.equal('DELETE');
    });

  });

  describe('with order,', function () {

    it('get one', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));
      var idOrder = 1;
      var response = corbelDriver.ec.order(idOrder).get();
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('GET');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('get one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.order().get();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('update one', function (done) {
      corbelRequestStub.returns(Promise.resolve(204));
      var productDataUpdate = '{\'test_object\':\'testUpdate\'}';
      var idOrder = 1;

      var response = corbelDriver.ec.order(idOrder).update(_.cloneDeep(productDataUpdate));
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal(204);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('PUT');
          expect(paramsRecived.data).to.be.equal(productDataUpdate);
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('update one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.order().update({});
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('delete one', function (done) {
      corbelRequestStub.returns(Promise.resolve(204));
      var idOrder = 1;

      var response = corbelDriver.ec.order(idOrder).delete();
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal(204);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/1');
          expect(paramsRecived.method).to.be.equal('DELETE');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

    it('delete one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.order().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('checkout', function () {
      corbelRequestStub.returns(Promise.resolve());
      var checkoutData = {
        paymentMethodIds: ['paymentMethod']
      };
      corbelDriver.ec.order('orderId').checkout(_.cloneDeep(checkoutData));

      var paramsRecived = corbel.request.send.firstCall.args[0];
      expect(paramsRecived.url).to.be.equal(EC_URL + 'order/orderId/checkout');
      expect(paramsRecived.method).to.be.equal('POST');
      expect(JSON.stringify(paramsRecived.data)).to.be.equal(JSON.stringify(checkoutData));
    });

    it('checkout without an id', function () {
      var checkoutData = {
        paymentMethodIds: ['paymentMethod']
      };
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.order().checkout(checkoutData);
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('checkout failed with empty payment methods', function (done) {
      corbelRequestStub.returns(Promise.resolve(202));
      var checkoutData = {
        paymentMethodIds: []
      };

      expect(corbelDriver.ec.order('orderId').checkout(checkoutData)).be.eventually.rejected
        .then(function (response) {
          expect(response.message).to.be.equal('One payment method is needed at least');
        }).should.be.eventually.fulfilled
        .and.notify(done);
    });

    it('prepare without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.order().prepare();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('prepare', function (done) {
      corbelRequestStub.returns(Promise.resolve(200));

      var response = corbelDriver.ec.order('orderId').prepare();
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal(200);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'order/orderId/prepare');
          expect(paramsRecived.method).to.be.equal('POST');
        }).should.be.eventually.fulfilled
        .and.notify(done);

    });

  });

  describe('with payment', function () {

    it('get all payments for the logged user', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));

      var params = {
        query: [{'$eq': {field: 'value'}}],
        pagination: {pageSize: 2, page: 3},
        sort: {field: 'asc'}
      };

      var response = corbelDriver.ec.payment().get(params);

      expect(response)
        .be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'payment?' + corbel.utils.serializeParams(params));
          expect(paramsRecived.method).to.be.equal('GET');
        })
        .should.notify(done);
    });

    it('get payments paginated', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));

      var params = {
        query: [{'$eq': {field: 'value'}}],
        pagination: {pageSize: 2, page: 3},
        sort: {field: 'asc'}
      };

      var response = corbelDriver.ec.payment().getAll(params);

      expect(response)
        .be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'payment/all?' + corbel.utils.serializeParams(params));
          expect(paramsRecived.method).to.be.equal('GET');
        })
        .should.notify(done);
    });
  });

  describe('with payment methods', function () {

    it('gets the payment method registered for a user', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));

      var response = corbelDriver.ec.paymentMethod().get();

      expect(response)
        .be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentmethod');
          expect(paramsRecived.method).to.be.equal('GET');
        })
        .should.notify(done);
    });

    it('adds a new payment method for the logged user', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));

      var params = {
        data: 'qawpdqjwdioqnfafb201u20rh4f9bq94fq3bf',
        name: 'mycard'
      };

      var response = corbelDriver.ec.paymentMethod().add(_.cloneDeep(params));

      expect(response)
        .be.eventually.fulfilled
        .then(function () {
          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentmethod');
          expect(paramsRecived.method).to.be.equal('POST');
          expect(JSON.stringify(paramsRecived.data)).to.be.equals(JSON.stringify(params));
        })
        .should.notify(done);
    });

    it('gets details of a single payment method by its id', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));
      var id = '1234';
      var response = corbelDriver.ec.paymentMethod().getById(id);

      expect(response)
        .be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentmethod/' + id);
          expect(paramsRecived.method).to.be.equal('GET');
        })
        .should.notify(done);
    });

    it('deletes a payment method', function (done) {
      corbelRequestStub.returns(Promise.resolve('ok'));
      var id = '1234';
      var response = corbelDriver.ec.paymentMethod().delete(id);

      expect(response)
        .be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('ok');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentmethod/' + id);
          expect(paramsRecived.method).to.be.equal('DELETE');
        })
        .should.notify(done);
    });
  });

  describe('with purchase,', function () {

    it('get one', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      var purchaseId = '1234';
      corbelDriver.ec.purchase().get(purchaseId);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'purchase/' + purchaseId);
      expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get one without id throws an error', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));

      expect(function () {
        corbelDriver.ec.purchase().get();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('get all', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      corbelDriver.ec.purchase().getAll();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'purchase');
      expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get all with params', function () {
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

      corbelRequestStub.returns(Promise.resolve('OK'));
      corbelDriver.ec.purchase().getAll(params);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.include(EC_URL + 'purchase');
      expect(callRequestParam.method).to.be.equal('GET');
      expect(callRequestParam.url).to.contain('api:query=' + encodeURIComponent('[{"$eq":{"field":"value"}}]') + '&api:sort=' + encodeURIComponent('{"field":"asc"}') + '&api:page=3&api:pageSize=2');
    });
  });

  describe('with payment plan,', function () {

    it('get one', function () {

      corbelRequestStub.returns(Promise.resolve('OK'));
      corbelDriver.ec.paymentPlan().get();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'paymentplan');
      expect(callRequestParam.method).to.be.equal('GET');
    });

    it('get one with id', function () {
      var idPlan = 1;

      corbelRequestStub.returns(Promise.resolve('OK'));
      corbelDriver.ec.paymentPlan(idPlan).get();

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'paymentplan/' + idPlan);
      expect(callRequestParam.method).to.be.equal('GET');
    });

    it('delete one', function (done) {
      corbelRequestStub.returns(Promise.resolve(204));
      var idPlan = 1;

      var response = corbelDriver.ec.paymentPlan().delete(idPlan);
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal(204);

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentplan/' + idPlan);
          expect(paramsRecived.method).to.be.equal('DELETE');
        }).should.be.eventually.fulfilled
        .and.notify(done);
    });

    it('delete one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.paymentPlan().delete();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('rescue one', function (done) {
      corbelRequestStub.returns(Promise.resolve('OK'));
      var idPlan = 1;
      var response = corbelDriver.ec.paymentPlan().rescue(_.cloneDeep(idPlan));
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('OK');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentplan/' + idPlan + '/rescue');
          expect(paramsRecived.method).to.be.equal('PUT');
        }).should.be.eventually.fulfilled
        .and.notify(done);
    });

    it('rescue one without an id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.paymentPlan().rescue();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('update a paymentMethod', function (done) {
      corbelRequestStub.returns(Promise.resolve('OK'));
      var idPlan = 1;
      var params = {
        'paymentMethodId': '1234'
      };
      var response = corbelDriver.ec.paymentPlan(_.cloneDeep(idPlan)).updatePaymentMethod(_.cloneDeep(params));
      expect(response).be.eventually.fulfilled
        .then(function (response) {
          expect(response).to.be.equal('OK');

          var paramsRecived = corbel.request.send.firstCall.args[0];
          expect(paramsRecived.url).to.be.equal(EC_URL + 'paymentplan/' + idPlan + '/paymentmethod');
          expect(paramsRecived.method).to.be.equal('PUT');
          expect(JSON.stringify(paramsRecived.data)).to.be.equal(JSON.stringify(params));
        }).should.be.eventually.fulfilled
        .and.notify(done);
    });

    it('update a PaymentMethod without paymentPlan id', function () {
      corbelRequestStub.returns(Promise.resolve('OK'));
      expect(function () {
        corbelDriver.ec.paymentPlan().updatePaymentMethod();
      }).to.throw('id value is mandatory and cannot be undefined');
    });

    it('get all with params', function () {
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
      corbelDriver.ec.paymentPlan().getAll(params);

      var callRequestParam = corbel.request.send.firstCall.args[0];
      expect(callRequestParam.url).to.be.equal(EC_URL + 'paymentplan/all?' + corbel.utils.serializeParams(params));
      expect(callRequestParam.method).to.be.equal('GET');
    });
  });
});
