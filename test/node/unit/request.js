'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  stream = require('stream');

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

    it('send method returns a promise', function() {

      var promise = request.send({
        method: 'GET',
        url: url
      });

      expect(promise).to.be.instanceof(Promise);
    });

    it('send method returns a promise and it resolves', function(done) {
      expect(request.send({
        method: 'GET',
        url: url
      }))
      .to.be.fulfilled.and.should.notify(done);
    });

    it('send method returns a promise and reject it', function(done) {
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

    it('send method accepts a success callback', function(done) {
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

    it('send method accepts an error callback', function(done) {
      request.send({
        method: 'GET',
        url: url + '404',
        error: function(data, status) {
          expect(status).to.be.equal(404);
          done();
        }
      });
    });

    it('send method encodes url parameters', function(done) {
      var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
        resolver.resolve();
      });
      var queryArgs = 'param1=1&param2=2&param3=3&combine=3+4';
      var parsedQueryArgs = encodeURI(queryArgs);
      //@TODO: the '+' character should be encoded?? I think yes. 
      //parsedQueryArgs = parsedQueryArgs.replace('+', encodeURIComponent('+'));
      url += '?';

      expect(request.send({
        method: 'GET',
        url: url + queryArgs
      })).to.be.fulfilled.then(function() {
        expect(_nodeAjaxStub.callCount).to.be.equal(1);
        expect(_nodeAjaxStub.getCall(0).args[0].url).to.be.equal(url + parsedQueryArgs);
      }).should.notify(done);
    });

    it('send method sends a String as application/octet-stream', function(done) {
        var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
          resolver.resolve();
        });
        var testText = 'Test';
      
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/octet-stream',
          data: testText
        })
        .should.be.eventually.fulfilled
        .then(function() {
            expect(typeof(_nodeAjaxStub.getCall(0).args[0].data)).to.be.equal('string');
            expect(_nodeAjaxStub.getCall(0).args[0].data).to.be.equal(testText);
        })
        .should.notify(done);
    });

    it('send method sends a stream as application/octet-stream', function(done) {
        var requestStream;
        var requestMockedFunction = function(options, callback){
          requestStream = new stream.Transform();
          requestStream._transform = function(chunk, encoding, done){
            done();
            callback();
          };
          return requestStream;
        };
        var getNodeRequestAjaxStub = sandbox.stub(request, '_getNodeRequestAjax').returns(requestMockedFunction);
        var getNodeRequestCallback = sandbox.stub(request, '_getNodeRequestCallback', function(context, params, resolver){
          return function(){
            resolver.resolve();
          };
        });

        var streamToSend = new stream.Readable();
        streamToSend.push('Test Stream');
        streamToSend.push(null);
        var pipeSpy = sandbox.spy(streamToSend, 'pipe');
     
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/octet-stream',
          data: streamToSend
        })
        .should.be.eventually.fulfilled
        .then(function() {
          expect(pipeSpy.callCount).to.equals(1);
          expect(pipeSpy.calledWith(requestStream)).to.equals(true);
          expect(getNodeRequestAjaxStub.callCount).to.equals(1);
          expect(getNodeRequestCallback.callCount).to.equals(1);
        })
        .should.notify(done);
    });
   
    it('send method sends a byteArray as application/octet-stream', function(done) {
        var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
          resolver.resolve();
        });
        var testText = 'Test';
        var byteText = [];
        for(var i = 0; i < testText.length; i++){
          byteText.push(testText.charCodeAt(i));
        }
      
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/octet-stream',
          data: byteText
        })
        .should.be.eventually.fulfilled
        .then(function() {
            var dataSended = _nodeAjaxStub.getCall(0).args[0].data;

            byteText.forEach(function(element, index) {
              expect(dataSended[index]).to.be.equal(element);
            });
            expect(typeof(_nodeAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
        })
        .should.notify(done);
    });

    it('send method sends an Uint8Array as application/octet-stream', function(done) {
        var _nodeAjaxStub = sandbox.stub(request, '_nodeAjax', function(params, resolver) {
          resolver.resolve();
        });
        var testText = 'Test';
        var ui8arr = new Uint8Array(testText.length);
        for(var i = 0; i < testText.length; i++){
          ui8arr[i] = testText.charCodeAt(i);
        }
      
        request.send({
          method: 'POST',
          url: url,
          contentType : 'application/octet-stream',
          data: ui8arr
        })
        .should.be.eventually.fulfilled
        .then(function() {
            var dataSended = _nodeAjaxStub.getCall(0).args[0].data;
            for(var key in dataSended ) {
              if (dataSended.hasOwnProperty(key)) {
                expect(dataSended[key]).to.be.equal(ui8arr[key]);
              }
            }
            expect(typeof(_nodeAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
        })
        .should.notify(done);
    });

    it('send method throws an error if try to send an ArrayBuffer as application/octet-stream', function() {
        var testText = 'Test';
        var buffer = new ArrayBuffer(testText.length);
        
        expect(function() {
            request.send({
              method: 'POST',
              url: url,
              contentType : 'application/octet-stream',
              data: buffer
            });
        }).to.throw('ArrayBuffer is not supported, please use Blob, File, Stream or ArrayBufferView'); 
    });

    it('send method throws an error if try to send an ArrayBuffer as application/blob', function() {
        var testText = 'Test';
        var buffer = new ArrayBuffer(testText.length);
        
        expect(function() {
            request.send({
              method: 'POST',
              url: url,
              contentType : 'application/blob',
              data: buffer
            });
        }).to.throw('ArrayBuffer is not supported, please use Blob'); 
    });

    it('throws an event if a driver is sent', function(done) {
      var driver = corbel.getDriver({ 'urlBase' : 'demo' });
      var stub = sandbox.stub();
      driver.on('request', stub);

      request
      .send({
        method: 'GET',
        url: url
      }, driver)
      .then(function(){
        expect(stub.callCount).to.equals(1);
      })
      .should.notify(done);
    });

  });

});
