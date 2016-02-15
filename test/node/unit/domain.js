'use strict'
/* jshint camelcase:false */
/* globals describe it beforeEach afterEach */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect

describe('With custom domain we can', function () {
  var sandbox = sinon.sandbox.create()

  var CONFIG = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    scopes: ['corbel-qa:client'],
    urlBase: 'https://{{module}}-corbel.io/'
  }

  var RESOURCE_COLLECTION_URL = CONFIG.urlBase.replace('{{module}}', 'resources') + '{{domain}}/resource/{{resource}}'

  var corbelDriver, corbelRequestStub

  beforeEach(function () {
    corbelDriver = corbel.getDriver(CONFIG)
    corbelRequestStub = sandbox.stub(corbel.request, 'send')
    corbelRequestStub.returns(Promise.resolve())
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('add a custom domain value', function () {
    var resource = 'resource:entity'
    var customDomain = 'oneTestDomain'

    var url = RESOURCE_COLLECTION_URL.replace('{{resource}}', resource).replace('{{domain}}', customDomain)
    expect(corbelDriver.domain(customDomain).resources.collection(resource).getURL()).to.be.equal(url)
  })

  it('does not persist the value on the configuration for consecutive calls', function (done) {
    var resource = 'resource:entity'
    var customDomain = 'oneTestDomainTwo'

    var urlWithDomain = RESOURCE_COLLECTION_URL.replace('{{resource}}', resource).replace('{{domain}}', customDomain)
    var urlWithoutDomain = RESOURCE_COLLECTION_URL.replace('{{resource}}', resource).replace('{{domain}}', 'unauthenticated')

    expect(corbelDriver.domain(customDomain).resources.collection(resource).getURL()).to.be.equal(urlWithDomain)

    corbelDriver.domain(customDomain).resources.collection(resource)
      .get()
      .then(function () {
        expect(corbelDriver.resources.collection(resource).getURL()).to.be.equal(urlWithoutDomain)
      })
      .should.notify(done)
  })
})
