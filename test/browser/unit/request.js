 'use strict';
 describe('corbel-js browser', function() {

     var sandbox;

     this.timeout(400000);

     beforeEach(function() {
         sandbox = sinon.sandbox.create();
     });

     afterEach(function() {
         sandbox.restore();
     });


     it('corbel-js namespace exists and exports as global', function() {
         expect(window).to.include.keys('corbel');
     });

     it('corbel-js contains all modules', function() {
         expect(window.corbel).to.include.keys('request');
     });


     describe('request module', function() {

         var url = 'http://localhost:3000/',
             urlRequestFail = 'http://localhost:3000/request/fail',
             request;

         before(function() {
             request = window.corbel.request;
         });

         it('should has own properties', function() {
             expect(request).to.include.keys('send');
         });


         it('send method accepts all http verbs', function() {

             request.send({
                 method: 'GET',
                 url: url
             });


             request.send({
                 method: 'POST',
                 url: url,
                 data: {
                     someData: 'data text'
                 }
             });

             request.send({
                 method: 'PUT',
                 url: url,
                 data: {
                     someData: 'data text'
                 }
             });

             request.send({
                 method: 'HEAD',
                 url: url,
                 data: {
                     someData: 'data text'
                 }
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

         it('send mehtod returns a promise and resolve it', function(done) {

             var resolveCallback = function() {};

             var spyResolve = sandbox.spy(resolveCallback);

             var promise = request.send({
                 method: 'GET',
                 url: url
             });

             promise.then(function() {
                 spyResolve();
                 expect(spyResolve.calledOnce).to.be.equal(true);
                 done();
             }).catch(function() {
                 done(new Error());
             });

         });

         it('send mehtod returns a promise and reject it', function(done) {
             var errorCallback = function() {};

             var spyError = sandbox.spy(errorCallback);

             var promise = request.send({
                 method: 'GET',
                 url: urlRequestFail
             });

             promise.then(function() {
                 done(new Error());
             }).catch(function() {
                 spyError();
                 expect(spyError.calledOnce).to.be.equal(true);
                 done();
             });

         });


         it('send mehtod accepts a success callback', function(done) {
             var successCallback = function() {

                 },
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 method: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback();
                     expect(spySuccessCallback.called).to.be.equal(true);
                     done();
                 },
                 error: function() {
                     done(new Error());
                 }
             });

         });

         it('success callback expect responseText, xhr.status , xhr object', function(done) {
             var successCallback = function() {},
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 method: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback.apply(this, arguments);
                     expect(spySuccessCallback.getCall(0).args[0]).to.be.a('object');
                     expect(spySuccessCallback.getCall(0).args[1]).to.be.a('number');
                     expect(spySuccessCallback.getCall(0).args[2]).to.be.an('object');
                     done();
                 },
                 error: function() {
                     done(new Error());
                 }
             });

         });

         it('send mehtod accepts an error callback', function(done) {
             var errorCallback = function() {

                 },
                 spyErrorCallback = sandbox.spy(errorCallback);

             request.send({
                 method: 'GET',
                 url: urlRequestFail,
                 error: function() {
                     spyErrorCallback();
                     expect(spyErrorCallback.calledOnce).to.be.equal(true);
                     done();
                 },
                 success: function() {
                     done(new Error());
                 }
             });

         });


     });


 });