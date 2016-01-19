'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon');

describe('corbel-js node', function() {

  var sandbox;

  this.timeout(20000);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('corbel-js contains all modules', function() {
    expect(corbel).to.include.keys('request');
  });

  describe('request module', function() {

    var url = 'http://localhost:3000/',
      request;

    before(function() {
      request = corbel.request;
    });

    it('should has own properties', function() {
      expect(request).to.include.keys('method');
      expect(request.method).to.include.keys('GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD');
    });

    it('expected methods are available', function() {
      expect(request).to.respondTo('send');
    });

    ['GET', 'POST', 'PATCH', 'PUT', 'HEAD'].forEach(function(verb) {
      it('send method accepts http ' + verb + ' verb', function(done) {

        var promise = request.send({
          method: verb,
          url: url
        });

        expect(promise).to.be.fulfilled.and.should.notify(done);

      });
    });

    it('send method throws an error if no url setting', function() {

      var fn = function() {
        return request.send({
          method: 'GET'
        });
      };

      expect(fn).to.throw('undefined:url');
    });

    it('send mehtod returns a promise', function() {

      var promise = request.send({
        method: 'GET',
        url: url
      });

      expect(promise).to.be.instanceof(Promise);
    });

    it('send mehtod returns a promise and it resolves', function(done) {
      expect(request.send({
        method: 'GET',
        url: url
      }))
      .to.be.fulfilled.and.should.notify(done);
    });

    it('send mehtod returns a promise and reject it', function(done) {
      var promise = request.send({
        method: 'GET',
        url: url + '404'
      });

      expect(promise).to.be.rejected
      .then(function(error) {
        expect(error.status).to.be.equal(404);
      })
      .should.notify(done);

    });

    it('send mehtod accepts a success callback', function(done) {
      request.send({
        method: 'GET',
        url: url,
        success: function() {
          done();
        },
        error: function(error) {
          done(error);
        },
      });
    });

    it('success callback expect responseText, status , incoming message object', function(done) {
      request.send({
        method: 'GET',
        url: url,
        success: function(data, status, httpResponse) {
          expect(data).to.be.a('object');
          expect(status).to.be.a('number');
          expect(httpResponse).to.be.an('object');
          done();
        }
      });
    });

    it('send mehtod accepts an error callback', function(done) {
      request.send({
        method: 'GET',
        url: url + '404',
        error: function(data, status) {
          expect(status).to.be.equal(404);
          done();
        }
      });
    });

    it('send method sends an stream, parse not necessary', function(done) {
        var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
          resolver.resolve();
        });
        var testText = 'Test';
        var byteText = [];
        for(var i = 0; i < testText.length; i++){
          byteText.push(testText.charCodeAt(i));
        }

        //@TODO: check if this is the proper way of sending a stream or we should send another thing
        var byteStream = new Uint8Array(byteText);
      
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/stream',
          data: byteStream
        })
        .should.be.eventually.fulfilled
        .then(function() {
            var dataSended = _nodeAjaxStub.getCall(0).args[0].data;

            Object.keys(dataSended).map(function(key) {
                expect(dataSended[key]).to.be.equal(byteStream[key]);
            });
            expect(typeof(_nodeAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
        })
        .should.notify(done);
    });

    it('send method parses blob to arrayBuffer', function(done) {
        var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
          resolver.resolve();
        });
        var testText = 'Test';
        var byteText = [];
        for(var i = 0; i < testText.length; i++){
          byteText.push(testText.charCodeAt(i));
        }
        //@TODO: check if this is the proper way of sending a "blob" or we should send another thing
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/blob',
          data: byteText
        })
        .should.be.eventually.fulfilled
        .then(function() {
            var dataSended = _nodeAjaxStub.getCall(0).args[0].data;
            var byteObject = corbel.utils.arrayToObject(byteText);

            Object.keys(dataSended).map(function(key) {
                expect(dataSended[key]).to.be.equal(byteObject[key]);
            });
            expect(typeof(_nodeAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
        })
        .should.notify(done);
    });

  });

});
