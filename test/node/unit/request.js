'use strict';

var corbel = require('../../../dist/corbel.js'),
    expect = require('chai').expect,
    sinon = require('sinon');

describe('corbel-js node', function() {

    var sandbox;

    this.timeout(4000);

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

            // server.respond(successResponse);

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

            // server.respond(errorResponse);

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
                    expect(spySuccessCallback.called).to.be.equal(true);
                }
            });


        });

        it('success callback expect responseText, status , incoming message object', function() {
            var successCallback = function() {},
                spySuccessCallback = sandbox.spy(successCallback);

            request.send({
                type: 'GET',
                url: url,
                success: function() {
                    spySuccessCallback.apply(this, arguments);
                    expect(spySuccessCallback.getCall(0).args[0]).to.be.a('string');
                    expect(spySuccessCallback.getCall(0).args[1]).to.be.a('number');
                    expect(spySuccessCallback.getCall(0).args[2]).to.be.an('object');
                }
            });


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
                    expect(spyErrorCallback.calledOnce).to.be.equal(true);
                },
                success: function() {}
            });

        });


    });


});
