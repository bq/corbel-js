'use strict';

var corbel = require('../../../dist/corbel.js'),
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon');

describe('corbel.Services module', function() {

  var sandbox,
    driver = corbel.getDriver({
      urlBase: 'urlBase/',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      audience: 'audience',
      scopes: 'scopes'
    }),
    service,
    requestStub;

  this.timeout(4000);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    service = new corbel.Services(driver);
    requestStub = sandbox.stub(corbel.request, 'send');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('contains expected static methods', function() {
    expect(corbel.Services).to.include.key('getLocationId');
    expect(corbel.Services).to.include.key('addEmptyJson');
  });

  it('contains expected static constants', function() {
    expect(corbel.Services._FORCE_UPDATE_TEXT).to.be.a('string');
    expect(corbel.Services._FORCE_UPDATE_MAX_RETRIES).to.be.a('number');
    expect(corbel.Services._FORCE_UPDATE_STATUS).to.be.a('string');
    expect(corbel.Services._FORCE_UPDATE_STATUS_CODE).to.be.a('number');
    expect(corbel.Services._UNAUTHORIZED_STATUS_CODE).to.be.a('number');
  });

  it('has expected methods', function() {
    expect(service).to.respondTo('request');
    expect(service).to.respondTo('_doRequest');
    expect(service).to.respondTo('_refreshHandler');
    expect(service).to.respondTo('_addAuthorization');
    expect(service).to.respondTo('_buildParams');
    expect(service).to.respondTo('_buildUri');
  });

  describe('in `request` method', function() {

    var spyRefreshHandler,
      spyTrigger,
      spyDoRequest,
      stubTokenBuilder,
      spyTokenCreate,
      spyTokenRefresh,
      spyConfigSet;

    var generatedAccessToken = corbel.jwt.generate({
      iss: 'example',
      aud: 'example',
      scope: 'example'
    }, 'secret');

    var generatedRefreshToken = corbel.jwt.generate({
      iss: 'example',
      aud: 'example',
      scope: 'example'
    }, 'secret');

    var tokenUser = {
      accessToken: generatedAccessToken,
      refreshToken: 'refreshToken',
      expiresAt: 111111
    };

    var tokenRefresh = {
      accessToken: generatedRefreshToken,
      refreshToken: 'newRefreshToken',
      expiresAt: 222222
    };

    var tokenClient = {
      accessToken: generatedAccessToken,
      expiresAt: 333333
    };

    var unAuthorizeResponse = Promise.reject({
      status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
      error: 'unauthorized'
    });

    beforeEach(function() {
      spyRefreshHandler = sandbox.spy(service, '_refreshHandler');
      spyTrigger = sandbox.spy(driver, 'trigger');
      spyDoRequest = sandbox.spy(service, '_doRequest');

      var tokenBuilder = driver.iam.token();
      spyTokenCreate = sandbox.spy(tokenBuilder, 'create');
      spyTokenRefresh = sandbox.spy(tokenBuilder, 'refresh');
      stubTokenBuilder = sandbox.stub(driver.iam, 'token').returns(tokenBuilder);

      spyConfigSet = sandbox.spy(driver.config, 'set');

    });

    describe('with a success response', function() {

      beforeEach(function() {
        requestStub.returns(Promise.resolve('data'));
      });

      it('returns success response', function(done) {

        expect(service.request({
          method: 'GET',
          url: 'url'
        })).to.be.fulfilled.then(function(response) {
          expect(response).to.be.equal('data');
        }).should.notify(done);

      });

      it('do not retry the request', function(done) {

        expect(service.request({
          method: 'GET',
          url: 'url'
        })).to.be.fulfilled.then(function() {
          expect(spyRefreshHandler.callCount).to.be.equal(0);
        }).should.notify(done);

      });

      it('`service:request:before` and `service:request:after` events are triggered once', function(done) {

        expect(service.request({
          method: 'GET',
          url: 'url'
        })).to.be.fulfilled.then(function() {
          expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
          expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
        }).should.notify(done);

      });

    });

    describe('with a rejected response', function() {

      describe('because of `force_update`', function() {


        beforeEach(function() {

          // reset force_update counter
          driver.config.set(corbel.Services._FORCE_UPDATE_STATUS, 0);

          // stub request
          requestStub.onCall(0).returns(Promise.reject({
            status: corbel.Services._FORCE_UPDATE_STATUS_CODE,
            textStatus: corbel.Services._FORCE_UPDATE_TEXT
          }));

        });

        it('triggers force update handler and rejects promise', function(done) {

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.rejected.then(function() {
            expect(driver.config.get(corbel.Services._FORCE_UPDATE_STATUS)).to.be.equal(1);

            expect(spyRefreshHandler.callCount).to.be.equal(0);
            expect(stubTokenBuilder.callCount).to.be.equal(0);
            expect(spyDoRequest.callCount).to.be.equal(1);
          }).should.notify(done);

        });


        it('`service:request:before` and `service:request:after` events are triggered once', function(done) {

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.rejected.then(function() {
            expect(driver.config.get(corbel.Services._FORCE_UPDATE_STATUS)).to.be.equal(1);
            expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
          }).should.notify(done);

        });

        it('`force:update` event are triggered once', function(done) {

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.rejected.then(function() {
            expect(driver.config.get(corbel.Services._FORCE_UPDATE_STATUS)).to.be.equal(1);
            expect(spyTrigger.withArgs('force:update').callCount).to.be.equal(1);
          }).should.notify(done);

        });

      });

      describe('because of unauthorized', function() {

        beforeEach(function() {
          driver.config.set(corbel.Iam.IAM_TOKEN, tokenUser);
          driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, 'scopesExample');

          // stub request
          requestStub.onCall(0).returns(unAuthorizeResponse);

        });

        it('tries to refresh token', function(done) {

          // stub refresh token
          requestStub.onCall(1).returns(Promise.resolve({
            status: 200,
            data: tokenRefresh
          }));

          // stub retry request
          requestStub.onCall(2).returns(Promise.resolve({
            status: 200,
            data: 'responseData'
          }));

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.fulfilled.then(function() {
            expect(spyRefreshHandler.calledOnce).to.be.equal(true);
            expect(stubTokenBuilder.calledOnce).to.be.equal(true);
            expect(spyTokenRefresh.calledOnce).to.be.equal(true);

            // events are triggered once
            expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(1);

          }).should.notify(done);

        });

        it('rejects after limit UNAUTHORIZED retries', function(done) {

          // stub refresh token
          requestStub.onCall(1).returns(Promise.resolve({
            status: 200,
            data: tokenRefresh
          }));
          // stub retry request
          requestStub.onCall(2).returns(unAuthorizeResponse);
          // stub refresh token
          requestStub.onCall(3).returns(Promise.resolve({
            status: 200,
            data: tokenRefresh
          }));
          //stub retry request
          requestStub.onCall(4).returns(unAuthorizeResponse);

          // stub refresh token
          requestStub.onCall(5).returns(Promise.resolve({
            status: 200,
            data: tokenRefresh
          }));

          // stub retry request
          requestStub.onCall(6).returns(Promise.resolve({
            status: 200,
            data: 'responseData'
          }));

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.rejected.then(function(response) {
            expect(response.status).to.equals(401);
            expect(requestStub.callCount).to.be.equal(3);
            expect(spyRefreshHandler.callCount).to.be.equal(1);
            expect(stubTokenBuilder.callCount).to.be.equal(1);
            expect(spyTokenRefresh.callCount).to.be.equal(1);

            // events are triggered once
            expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(1);
          }).should.notify(done);

        });

        it('rejects after 1 retries, when the refresh token fails', function(done) {

          // stub refresh token
          requestStub.onCall(1).returns(unAuthorizeResponse);
          // stub retry request
          requestStub.onCall(2).returns(unAuthorizeResponse);
          // stub refresh token
          requestStub.onCall(3).returns(unAuthorizeResponse);
          // stub retry request
          requestStub.onCall(4).returns(unAuthorizeResponse);

          expect(service.request({
            method: 'GET',
            url: 'url'
          })).to.be.rejected.then(function(response) {
            expect(response.status).to.equals(401);
            expect(requestStub.callCount).to.be.equal(2);
            expect(spyRefreshHandler.callCount).to.be.equal(1);
            expect(stubTokenBuilder.callCount).to.be.equal(1);
            expect(spyTokenRefresh.callCount).to.be.equal(1);

            // events are triggered once
            expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
            expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(0);
          }).should.notify(done);

        });

        describe('in refresh token handler', function() {

          it('can be triggered only once at same time', function(done) {

            driver.config.set(corbel.Iam.IAM_TOKEN, tokenClient);

            // stub request
            requestStub.returns(unAuthorizeResponse);

            var promises = [];
            for (var i = 0; i < 10; i++) {
              promises.push(service.request({
                method: 'GET',
                url: 'url'
              }));
            }

            expect(Promise.all(promises)).to.be.rejected.then(function() {
              // number of refresh token requests
              expect(spyRefreshHandler.callCount).to.be.equal(10);
              // number of token builder requests
              expect(stubTokenBuilder.callCount).to.be.equal(1);

              // `service:request:before` and `service:request:after` events are triggered as expected
              // events are triggered once
              expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(10);
              expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(10);
              expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(0);

            }).should.notify(done);

          });


          it('if fails, return original error', function(done) {

            // stub request with custom error
            requestStub.onCall(0).returns(Promise.reject({
              status: corbel.Services._UNAUTHORIZED_STATUS_CODE,
              error: 'original_error'
            }));
            // stub refresh token
            requestStub.onCall(1).returns(unAuthorizeResponse);

            expect(service.request({
              method: 'GET',
              url: 'url'
            })).to.be.rejected.then(function(response) {
              expect(spyRefreshHandler.calledOnce).to.be.equal(true);
              expect(stubTokenBuilder.calledOnce).to.be.equal(true);
              expect(spyTokenRefresh.calledOnce).to.be.equal(true);
              expect(spyDoRequest.calledOnce).to.be.equal(true);

              expect(response.status).to.be.equal(401);
              expect(response.error).to.be.equal('original_error');

              // events are triggered once
              expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
              expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
              expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(0);

            }).should.notify(done);

          });

          describe('if success', function() {

            beforeEach(function() {

              // stub refresh token
              requestStub.onCall(1).returns(Promise.resolve({
                status: 200,
                data: tokenRefresh
              }));

            });

            it('retries request', function(done) {

              // stub retry request
              requestStub.onCall(2).returns(Promise.resolve({
                status: 200,
                data: 'responseData'
              }));

              expect(service.request({
                method: 'GET',
                url: 'url'
              })).to.be.fulfilled.then(function() {
                expect(spyRefreshHandler.callCount).to.be.equal(1);
                expect(spyDoRequest.callCount).to.be.equal(2);
                expect(stubTokenBuilder.calledOnce).to.be.equal(true);
                expect(spyTokenRefresh.calledOnce).to.be.equal(true);

                var args0 = spyDoRequest.getCall(0).args[0];
                var args1 = spyDoRequest.getCall(1).args[0];

                expect(args0.url).to.be.equal(args1.url);
                expect(args0.method).to.be.equal(args1.method);
                expect(args0.contentType).to.be.equal(args1.contentType);
                expect(args0.dataType).to.be.equal(args1.dataType);
                expect(args0.data).to.be.equal(args1.data);

                expect(args0.headers.Authorization).to.be.equal('Bearer ' + generatedAccessToken);
                expect(args1.headers.Authorization).to.be.equal('Bearer ' + generatedRefreshToken);

                // events are triggered once
                expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(1);

              }).should.notify(done);


            });

            describe('in retry request', function() {

              it('if success, returns response', function(done) {

                // stub retry request
                requestStub.onCall(2).returns(Promise.resolve({
                  status: 200,
                  data: 'responseData'
                }));

                expect(service.request({
                  method: 'GET',
                  url: 'url'
                })).to.be.fulfilled.then(function(response) {
                  expect(response.data).to.be.equal('responseData');
                }).should.notify(done);

              });

              it('if error, return retry error', function(done) {

                // stub retry request
                requestStub.onCall(2).returns(Promise.reject({
                  status: 444,
                  error: 'retry_error'
                }));

                expect(service.request({
                  method: 'GET',
                  url: 'url'
                })).to.be.rejected.then(function(response) {
                  expect(spyRefreshHandler.calledOnce).to.be.equal(true);
                  expect(stubTokenBuilder.calledOnce).to.be.equal(true);
                  expect(spyTokenRefresh.calledOnce).to.be.equal(true);
                  expect(spyDoRequest.calledTwice).to.be.equal(true);

                  expect(response.status).to.be.equal(444);
                  expect(response.error).to.be.equal('retry_error');
                }).should.notify(done);

              });

            });

          });

        });

        describe('with client authorization', function() {

          afterEach(function() {
            corbel.Services._UNAUTHORIZED_MAX_RETRIES = 1;
          });

          describe('Configured with credentials', function() {

            beforeEach(function() {
              driver.config.set(corbel.Iam.IAM_TOKEN, tokenClient);
              corbel.Services._UNAUTHORIZED_MAX_RETRIES = 3;
            });

            it('refreshes token more than one time if needed', function(done) {

              /**
               * refreshToken response with client token because it will call
               * `iam.token().create()` instead of `iam.token.refresh()`
               */

              // stub refresh token
              requestStub.onCall(1).returns(Promise.resolve({
                status: 200,
                data: tokenClient
              }));

              // stub retry request
              requestStub.onCall(2).returns(unAuthorizeResponse);

              // stub refresh token
              requestStub.onCall(3).returns(Promise.resolve({
                status: 200,
                data: tokenClient
              }));

              // stub retry request
              requestStub.onCall(4).returns(Promise.resolve({
                status: 203,
                data: 'responseData'
              }));

              expect(service.request({
                method: 'GET',
                url: 'url'
              })).to.be.fulfilled.then(function(response) {
                expect(response.status).to.equals(203);
                //It has setted in the config the new data
                expect(spyConfigSet.callCount).to.be.above(2);
                expect(spyConfigSet.calledWith(corbel.Iam.IAM_TOKEN)).to.be.equal(true);
                expect(spyConfigSet.calledWith(corbel.Iam.IAM_DOMAIN)).to.be.equal(true);
                expect(spyConfigSet.calledWith(corbel.Iam.IAM_TOKEN_SCOPES)).to.be.equal(true);

                expect(spyRefreshHandler.callCount).to.be.equal(2);
                expect(stubTokenBuilder.callCount).to.be.equal(2);
                expect(spyTokenCreate.callCount).to.be.equal(2);

                // events are triggered once
                expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(2);

              }).should.notify(done);

            });

          });

          describe('Configured without credentials, only with iamToken', function() {

            beforeEach(function() {

              driver.config.set(corbel.Iam.IAM_TOKEN, tokenClient);
              driver.config.set('clientSecret', null);
              driver.config.set('clientId', null);
              driver.config.set('scopes', null);

            });

            it('tries to refresh token but fails as credentials are not provided', function(done) {
              // stub refresh token (has not to be called), but leave it for mocking a failing case
              // otherwise it will pass the test but the functionality may be broken
              requestStub.onCall(1).returns(Promise.resolve({
                status: 200,
                data: tokenClient
              }));

              // stub retry request (has not to be called), but leave it for mocking a failing case
              // otherwise it will pass the test but the functionality may be broken
              requestStub.onCall(2).returns(Promise.resolve({
                status: 203,
                data: 'responseData'
              }));

              expect(service.request({
                method: 'GET',
                url: 'url'
              })).to.be.rejected.then(function(response) {
                expect(response.status).to.equals(401);
                //It has setted in the config the new data
                expect(requestStub.callCount).to.be.equal(1);
                expect(spyConfigSet.withArgs(corbel.Services._UNAUTHORIZED_NUM_RETRIES, 0).callCount).to.be.equal(1);
                expect(spyConfigSet.calledWith(corbel.Services._UNAUTHORIZED_NUM_RETRIES, 0)).to.be.equal(true);
                expect(spyRefreshHandler.callCount).to.be.equal(1);
                expect(stubTokenBuilder.callCount).to.be.equal(1);
                expect(spyTokenCreate.callCount).to.be.equal(1);

                // events are triggered once
                expect(spyTrigger.withArgs('service:request:before').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('service:request:after').callCount).to.be.equal(1);
                expect(spyTrigger.withArgs('token:refresh').callCount).to.be.equal(0);

              }).should.notify(done);

            });

          });

        });

      });


    });

  });

  describe('in `getLocationId` method', function() {

    it('returns undefined with invalid response or location', function() {
      // undefined responseObject
      var response = corbel.Services.getLocationId();
      expect(response).to.be.equal(undefined);

      // empty responseObject
      response = corbel.Services.getLocationId({});
      expect(response).to.be.equal(undefined);

      // empty xhr location header
      response = corbel.Services.getLocationId({
        xhr: {
          getResponseHeader: function() {
            return undefined;
          }
        }
      });
      expect(response).to.be.equal(undefined);

      // empty location header
      response = corbel.Services.getLocationId({
        response: {
          headers: {}
        }
      });
      expect(response).to.be.equal(undefined);
    });

    it('returns id with valid response or location', function() {

      var validLocation = '/some/location/locationId';

      var browserResponse = {
        xhr: {
          getResponseHeader: function() {
            return validLocation;
          }
        }
      };
      var nodeResponse = {
        response: {
          headers: {
            location: validLocation
          }
        }
      };

      var response = corbel.Services.getLocationId(browserResponse);
      expect(response).to.be.equal('locationId');

      response = corbel.Services.getLocationId(nodeResponse);
      expect(response).to.be.equal('locationId');

    });

  });

  describe('in `addEmptyJson` method', function() {

    it('returns expected value with falsy values for "json" types', function() {
      var response = corbel.Services.addEmptyJson(undefined, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson(false, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson(0, 'json');
      expect(response).to.be.equal('{}');

      response = corbel.Services.addEmptyJson('', 'json');
      expect(response).to.be.equal('{}');
    });

    it('returns expected value with falsy values for "no-json" types', function() {
      var response = corbel.Services.addEmptyJson(undefined, 'text');
      expect(response).to.be.equal(undefined);

      response = corbel.Services.addEmptyJson(false, 'text');
      expect(response).to.be.equal(false);

      response = corbel.Services.addEmptyJson(0, 'text');
      expect(response).to.be.equal(0);

      response = corbel.Services.addEmptyJson('', 'text');
      expect(response).to.be.equal('');
    });

  });

});
