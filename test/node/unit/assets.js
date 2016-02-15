'use strict'
/* jshint camelcase:false */
/* globals describe it beforeEach afterEach */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect

describe('In Assets module we can', function () {
  var sandbox = sinon.sandbox.create()
  var CONFIG = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

    urlBase: 'https://{{module}}-corbel.io/'

  }

  var ASSET_URL = CONFIG.urlBase.replace('{{module}}', 'assets') + 'asset'

  var corbelDriver = corbel.getDriver(CONFIG)

  var corbelRequestStub

  beforeEach(function () {
    corbelRequestStub = sandbox.stub(corbel.request, 'send')
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('create one asset', function () {
    corbelRequestStub.returns(Promise.resolve())
    var testData = "{'test_object':'test'}"
    corbelDriver.assets.asset().create(testData)

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL)
    expect(callRequestParam.method).to.be.equal('POST')
    expect(callRequestParam.data).to.be.equal(testData)
  })

  it('get my user assets', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))

    corbelDriver.assets.asset().get()

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL)
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('get my user assets all with params', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))
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
    }

    corbelDriver.assets.asset().get(params)

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '?api:query=' + encodeURIComponent('[{"$eq":{"field":"value"}}]') + '&api:sort=' + encodeURIComponent('{"field":"asc"}') + '&api:page=3&api:pageSize=2')
    expect(callRequestParam.query).to.be.equal()
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('get all assets', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))

    corbelDriver.assets.asset('all').get()

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '/all')
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('get all with params', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))
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
    }

    corbelDriver.assets.asset('all').get(params)

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '/all?' + 'api:query=' + encodeURIComponent('[{"$eq":{"field":"value"}}]') + '&api:sort=' + encodeURIComponent('{"field":"asc"}') + '&api:page=3&api:pageSize=2')
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('get aggregated count', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))
    var params = {
      aggregation: {'$count': '*'}
    }

    corbelDriver.assets.asset('all').get(params)

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '/all?' + 'api:aggregation=' + encodeURIComponent('{"$count":"*"}'))
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('delete an undefinded asset', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))

    expect(function () {
      corbelDriver.assets.asset().delete()
    }).to.throw('id value is mandatory and cannot be undefined')
  })

  it('delete one asset', function () {
    corbelRequestStub.returns(Promise.resolve())
    var assetId = 1

    corbelDriver.assets.asset(assetId).delete()

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '/' + assetId)
    expect(callRequestParam.method).to.be.equal('DELETE')
  })

  it('get access', function () {
    corbelRequestStub.returns(Promise.resolve())
    corbelDriver.assets.asset().access()

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(ASSET_URL + '/access')
    expect(callRequestParam.method).to.be.equal('GET')
    expect(callRequestParam.headers['No-Redirect']).to.be.equal(true)
  })
})
