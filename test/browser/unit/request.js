 'use strict';
 describe('Silkroad-js browser', function() {

     var sandbox;

     this.timeout(4000);

     beforeEach(function() {
         sandbox = sinon.sandbox.create();
     });

     afterEach(function() {
         sandbox.restore();
     });


     it('Silkroad-js namespace exists and exports as global', function() {
         expect(window).to.include.keys('Silkroad');
     });

     it('Silkroad-js contains all modules', function() {
         expect(window.Silkroad).to.include.keys('request');
     });


     describe('request module', function() {

         var server,
             url = 'http://localhost:3000/',
             request,
             errorResponse = [400, {
                     'Content-Type': 'application/json',
                     'Access-Controll-Allow-origin': '*',
                     'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
                 },
                 JSON.stringify({
                     error: 'error'
                 })
             ],
             successResponse = [200, {
                     'Content-Type': 'application/json',
                     'Access-Controll-Allow-origin': '*',
                     'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
                 },
                 JSON.stringify({
                     result: 'result'
                 })
             ];

         before(function() {
             server = sinon.fakeServer.create();
             request = window.Silkroad.request;
         });

         after(function() {
             server.restore();
         });

         beforeEach(function() {

             server.respondWith(successResponse);

         });

         it('should has own properties', function() {
             expect(request).to.include.keys('send');
         });


         it('send method accepts all http verbs', function() {

             request.send({
                 type: 'GET',
                 url: url
             });

             request.send({
                 type: 'POST',
                 url: url
             });

             request.send({
                 type: 'PUT',
                 url: url
             });

             request.send({
                 type: 'HEAD',
                 url: url
             });

         });

         it('send method throws an error if no url setting', function() {

             var fn = function() {
                 return request.send({
                     type: 'GET'
                 });
             };

             expect(fn).to.throw(Error);
         });

         it('send mehtod returns a promise', function() {

             var promise = request.send({
                 type: 'GET',
                 url: url
             });

             expect(promise).to.be.instanceof(Promise);
         });

         it('send mehtod returns a promise and resolve it', function() {

             var resolveCallback = function() {};

             var spyResolve = sandbox.spy(resolveCallback);

             var promise = request.send({
                 type: 'GET',
                 url: url
             });

             server.respond(successResponse);

             promise.then(function() {
                 spyResolve();
                 expect(spyResolve.calledOnce).to.be.equal(true);
             });

         });

         it('send mehtod returns a promise and reject it', function() {
             var errorCallback = function() {};

             var spyError = sandbox.spy(errorCallback);

             var promise = request.send({
                 type: 'GET',
                 url: url
             });

             server.respond(errorResponse);

             promise.then(function() {
                 spyError();
                 expect(spyError.calledOnce).to.be.equal(true);
             });

         });


         it('send mehtod accepts a success callback', function() {
             var successCallback = function() {

                 },
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 type: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback();
                 }
             });

             server.respond(successResponse);

             expect(spySuccessCallback.called).to.be.equal(false); //provocar fallo

         });

         it('success callback expect responseText, xhr.status , xhr object', function() {
             var successCallback = function() {},
                 spySuccessCallback = sandbox.spy(successCallback);

             request.send({
                 type: 'GET',
                 url: url,
                 success: function() {
                     spySuccessCallback.apply(this, arguments);
                 }
             });

             server.respond(successResponse);

             expect(spySuccessCallback.args[0][0]).to.be.a('string');
             expect(spySuccessCallback.args[0][1]).to.be.a('number');
             expect(spySuccessCallback.args[0][2]).to.be.an('object');

         });

         it('send mehtod accepts an error callback', function() {
             var errorCallback = function() {

                 },
                 spyErrorCallback = sandbox.spy(errorCallback);

             request.send({
                 type: 'GET',
                 url: url,
                 error: function() {
                     spyErrorCallback();
                 },
                 success: function() {
                     window.console.log('a');
                 }
             });

             server.respond(errorResponse);

             expect(spyErrorCallback.calledOnce).to.be.equal(true);

         });


     });


 });