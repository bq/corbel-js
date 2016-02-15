'use strict'
/* jshint camelcase:false */
/* globals describe it beforeEach afterEach */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect

describe('In Evci module we can', function () {
  var sandbox = sinon.sandbox.create()

  var CONFIG = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations'],

    urlBase: 'https://{{module}}-corbel.io/'

  }

  var EVENT_TYPE = 'log:error'

  var EVENT_DATA = "{'test_object':'test'}"

  var EVCI_URL = CONFIG.urlBase.replace('{{module}}', corbel.Evci.moduleName) + 'event'

  var corbelDriver = corbel.getDriver(CONFIG)

  var corbelRequestStub

  beforeEach(function () {
    corbelRequestStub = sandbox.stub(corbel.request, 'send')
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('generate evci query correctly', function () {
    corbelRequestStub.returns(Promise.resolve())
    corbelDriver.evci.event(EVENT_TYPE).publish(EVENT_DATA)

    var callRequestParam = corbelRequestStub.getCall(0).args[0]
    expect(callRequestParam.url).to.be.equal(EVCI_URL + '/' + EVENT_TYPE)
    expect(callRequestParam.method).to.be.equal('POST')
    expect(callRequestParam.data).to.be.equal(EVENT_DATA)
  })

  it('throw exception when create event without type', function () {
    corbelRequestStub.returns(Promise.resolve('OK'))
    expect(function () {
      corbelDriver.evci.event().publish(EVENT_DATA)
    }).to.throw('eventType value is mandatory and cannot be undefined')
  })

  it('throw exception when publish event without data', function () {
    expect(corbelDriver.evci.event(EVENT_TYPE).publish).to.throw('Send event require data')
  })
})
