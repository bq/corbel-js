'use strict';

describe('corbel-js browser', function() {

  var sandbox;
  this.timeout(4000);
  var fakeServer;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    fakeServer = sinon.fakeServer.create();
    fakeServer.autoRespond = true;
  });

  afterEach(function() {
    sandbox.restore();
    fakeServer.restore();
  });

  it('corbel-js contains all modules', function() {
    expect(corbel).to.include.keys('request');
  });

  describe('request module', function() {

    var url = '/url',
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
        var fakeResponse = [
          200, {
            'Content-type': 'application/json'
          },
          '{}'
        ];

        fakeServer.respondWith(verb, url, fakeResponse);

        request.send({
          method: verb,
          url: url
        }).then(function() {
          done();
        }).catch(function(error) {
          done(error);
        });
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

    it('send mehtod 200 returns a promise and it resolves', function(done) {
      var fakeResponse = [
        200, {
          'Content-type': 'application/json'
        },
        '{}'
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

      request.send({
        method: 'GET',
        url: url
      }).then(function() {
        done();
      });
    });

    it('send mehtod 404 returns a promise and reject it', function(done) {
      var fakeResponse = [
        404, {
          'Content-type': 'application/json'
        },
        '{}'
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

      var promise = request.send({
        method: 'GET',
        url: url
      });

      promise.catch(function(error) {
        expect(error.status).to.be.equal(404);
        done();
      });
    });

    it('send mehtod 500 returns a promise and reject it', function(done) {
      var fakeResponse = [
        500, {
          'Content-type': 'application/json'
        },
        '{}'
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

      var promise = request.send({
        method: 'GET',
        url: url
      });

      promise.catch(function(error) {
        expect(error.status).to.be.equal(500);
        done();
      });
    });


    it('send method returns a promise and it reject when client is disconnected', function(done) {

      fakeServer.respondWith('GET', url, function(request){
        request.error = true;
        request.setResponseHeaders({
          'Content-Type': 'text/html',
          status: 0
        });
        request.setResponseBody('');
      });

      var promise = request.send({
        method: 'GET',
        url: url
      });

      promise.catch(function(error) {
        expect(error.status).to.be.equal(0);
        done();
      });
    });

    it('send method returns a promise and it returns status 200 when client status 0 but there is no disconnection error', function(done) {

      fakeServer.respondWith('GET', url, function(request){

        request.setResponseHeaders({
          'Content-Type': 'text/html',
          status: 0
        });
        request.setResponseBody('');
      });

      var promise = request.send({
        method: 'GET',
        url: url
      });

      promise.then(function(error) {
        expect(error.status).to.be.equal(200);
        done();
      });
    });

    it('send mehtod accepts a success callback', function(done) {
      var fakeResponse = [
        200, {
          'Content-type': 'application/json'
        },
        '{}'
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

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
      var responseData = {
        DATA: 'DATA'
      };

      var fakeResponse = [
        200, {
          'Content-type': 'application/json'
        },
        JSON.stringify(responseData)
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

      request.send({
        method: 'GET',
        url: url,
        success: function(data, status, httpResponse) {
          expect(data).to.be.a('object');
          expect(data).to.deep.equal(responseData);
          expect(status).to.be.a('number');
          // @TODO: weird assertion
          expect(typeof httpResponse).to.be.equal('object');
          done();
        }
      });
    });

    it('send mehtod accepts an error callback', function(done) {
      var fakeResponse = [
        404, {
          'Content-type': 'application/json'
        },
        '{}'
      ];

      fakeServer.respondWith('GET', url, fakeResponse);

      request.send({
        method: 'GET',
        url: url,
        error: function(data, status) {
          expect(status).to.be.equal(404);
          done();
        }
      });
    });

    it('send too large GET rewrite to POST and active override method header', function(done) {
      var responseData = {
        DATA: 'DATA'
      };
      var okResponse = [
        200, {
          'Content-type': 'application/json'
        },
        JSON.stringify(responseData)
      ];

      fakeServer.respondWith('POST', url, okResponse);

      var largeUrl = url + '?' + new Array(5000).join('a');
      request.send({
        method: 'GET',
        url: largeUrl,
        success: function(data, status) {
          expect(data).to.deep.equal(responseData);
          expect(status).to.be.equal(200);
          expect(fakeServer.requests[0]).to.have.deep.property('requestHeaders.X-HTTP-Method-Override', 'GET');
          expect(fakeServer.requests[0]).to.have.deep.property('requestHeaders.content-type', 'application/x-www-form-urlencoded;charset=utf-8');
          done();
        }
      });
    });
   
    // Phantom creates problem in this test
    if(window.chrome) {
        it('send method parses stream to arrayBuffer', function(done) {
            var _browserAjaxStub = sandbox.stub(request, '_browserAjax', function(params, resolver) {
              resolver.resolve();
            });
            var testText = 'Test';
            var byteText = [];
            for(var i = 0; i < testText.length; i++){
              byteText.push(testText.charCodeAt(i));
            }
            var byteStream = new Uint8Array(byteText);
          
            request.send({
              method: 'POST',
              url: url,
              contentType : 'application/stream',
              data: byteStream
            })
            .should.be.eventually.fulfilled
            .then(function() {
                var dataSended = _browserAjaxStub.getCall(0).args[0].data;

                Object.keys(dataSended).map(function(key) {
                    expect(dataSended[key]).to.be.equal(byteStream[key]);
                });
                expect(typeof(_browserAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
            })
            .should.notify(done);

        });
    }

    // Phantom creates problem in this test
    if(window.chrome) {
        it('send method sends a blob, parse not necessary', function(done) {
            var _browserAjaxStub = sandbox.stub(request, '_browserAjax', function(params, resolver) {
              resolver.resolve();
            });
            var testText = 'Test';
            var byteText = [];
            for(var i = 0; i < testText.length; i++){
              byteText.push(testText.charCodeAt(i));
            }
            var blobText = new Blob(byteText);
          
            request.send({
              method: 'POST',
              url: url,
              contentType : 'application/blob',
              data: blobText
            })
            .should.be.eventually.fulfilled
            .then(function() {
                var dataSended = _browserAjaxStub.getCall(0).args[0].data;

                Object.keys(dataSended).map(function(key) {
                    expect(dataSended[key]).to.be.equal(blobText[key]);
                });
                expect(typeof(_browserAjaxStub.getCall(0).args[0].data)).to.be.equal('object');
            })
            .should.notify(done);
        });
    }
  });
});
