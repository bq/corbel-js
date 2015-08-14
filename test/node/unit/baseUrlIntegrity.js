/*jshint newcap: false */
'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect;

var TEST_ENDPOINT = 'https://resources-qa.bqws.io/v1.0/';

var TEST_ENDPOINT = 'https://resources-qa.bqws.io/v1.0/',

  URL_EXAMPLE_RESOURCES = TEST_ENDPOINT + 'resource/resource:entity?api:search={"text":"test"}';

var CONFIG = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  scopes: 'scopes',

  urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
};

describe('corbel resources module', function() {

  var sandbox = sinon.sandbox.create(),
    corbelDriver,
    resources;

  before(function() {
    corbelDriver = corbel.getDriver(CONFIG);
    resources = corbelDriver.resources;
  });

  after(function() {});

  beforeEach(function() {
    sandbox.stub(corbel.request, 'send').returns(Promise.resolve());
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('url integrity', function() {
    this.timeout(10000);

    it('does not stack multiple api:definitions', function(done) {
      var params = {
        search : {
          text: 'test'
        }
      };

      expect(resources.collection('resource:entity').getURL(params)).to.be.equal(URL_EXAMPLE_RESOURCES);
      
      //After N calls the params object does not get modified by reference.
      var promises = [resources.collection('resource:entity').get(params), resources.collection('resource:entity').get(params)];

      Promise.all(promises)
        .then(function(){
          expect(resources.collection('resource:entity').getURL(params)).to.be.equal(URL_EXAMPLE_RESOURCES);
          done();
        })
        .catch(function(err){
          console.log(err);
          done(err);
        });
    });

  });
});