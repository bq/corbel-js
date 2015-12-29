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
      expect(request.method).to.include.keys('GET');
      expect(request.method).to.include.keys('POST');
      expect(request.method).to.include.keys('PUT');
      expect(request.method).to.include.keys('DELETE');
      expect(request.method).to.include.keys('OPTIONS');
      expect(request.method).to.include.keys('PATCH');
      expect(request.method).to.include.keys('HEAD');
    });

    it('expected methods are available', function() {
      expect(request).to.respondTo('send');
    });

    it('send method accepts all http verbs', function(done) {

      request.send({
        method: 'GET',
        url: url
      }).then(function() {
        return request.send({
          method: 'POST',
          url: url
        });
      }).then(function() {
        return request.send({
          method: 'PATCH',
          url: url
        });
      }).then(function() {
        return request.send({
          method: 'PUT',
          url: url
        });
      }).then(function() {
        return request.send({
          method: 'HEAD',
          url: url
        });
      }).then(function() {
        done();
      }).catch(function(error) {
        done(error);
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

      request.send({
        method: 'GET',
        url: url
      }).then(function() {
        done();
      });

    });

    it('send mehtod returns a promise and reject it', function(done) {
      var promise = request.send({
        method: 'GET',
        url: url + '404'
      });

      promise.catch(function(error) {
        expect(error.status).to.be.equal(404);
        done();
      });

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

    it('send mehtod encodes url parameters', function(done) {
      var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
        resolver.resolve();
      });
      var queryArgs = 'param1=1&param2=2&param3=3';
      var parsedQueryArgs = encodeURI(queryArgs);
      url += '?'; 

      request.send({
        method: 'GET',
        url: url + queryArgs
      })
        .then(function() {
          expect(_nodeAjaxStub.callCount).to.be.equal(1);
          expect(_nodeAjaxStub.getCall(0).args[0].url).to.be.equal(url + parsedQueryArgs);
          done();
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
