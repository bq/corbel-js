'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('corbel IAM module', function() {

    var sandbox = sinon.sandbox.create();
    
    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',
        audience: 'audience',
        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],

        domain: 'domain-example',

        urlBase: 'https://{{module}}-corbel.io/'

    };

    var IAM_END_POINT = CONFIG.urlBase.replace('{{module}}', 'iam');

    var corbelDriver = corbel.getDriver(CONFIG);

    var corbelRequestStub;

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send').returns(Promise.resolve());
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Creates accessToken', function() {

        it('Using without params', function() {
            sandbox.stub(corbel.jwt, '_generateExp').returns(1234);
            var assertion = corbelDriver.iam.token()._getJwt({
                claims: {
                    exp: 1234
                }
            });
            corbelDriver.iam.token().create();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(assertion);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        it('Using with empty params', function() {
            sandbox.stub(corbel.jwt, '_generateExp').returns(1234);
            var assertion = corbelDriver.iam.token()._getJwt({
                claims: {
                    exp: 1234
                }
            });
            corbelDriver.iam.token().create({});
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(assertion);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        describe('mandatory values in config', function(){
            it('expects clientSecret to be defined', function(){
                var config = {
                    urlBase : 'http://test.com'
                };
                var driver = corbel.getDriver(config);
                expect(function(){
                    driver.iam.token()._getJwt();
                }).to.throw('config:undefined:clientSecret');
            });

            it('expects clientId to be defined', function(){
                var config = {
                    urlBase : 'http://test.com',
                    clientSecret : 'test'
                };
                var driver = corbel.getDriver(config);
                expect(function(){
                    driver.iam.token()._getJwt();
                }).to.throw('config:undefined:clientId');
            });

            it('passes if all mandatory values are provided', function(){
                var config = {
                    urlBase : 'http://test.com',
                    clientSecret : 'test',
                    clientId : 'test'
                };
                var driver = corbel.getDriver(config);
                expect(function(){
                    driver.iam.token()._getJwt();
                }).not.to.throw(Error);
            });
        });

        it('Using JWT correctly', function() {
            var testJwt = '_jwt_';
            corbelDriver.iam.token().create({
                jwt: testJwt
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        it('Using claims correctly', function() {
            var testClaims = {
                iss: 'clientId',
                scope: 'scopes',
                aud: 'audience',
                exp: 'expireAt',
                prn: 'principal'
            };
            var assertion = corbel.jwt.generate(testClaims, CONFIG.clientSecret);
            corbelDriver.iam.token().create({
                claims: testClaims
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(assertion);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        it('Getting token with cookie with POST', function() {
            var testClaims = {
                iss: 'clientId',
                scope: 'scopes',
                aud: 'audience',
                exp: 'expireAt',
                prn: 'principal'
            };
            corbelDriver.iam.token().create({
                claims: testClaims
            }, true);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.headers.RequestCookie).to.be.equal('true');
        });

        it('Getting token with cookie with GET', function() {
            var testJwt = '_jwt_';
            var testOauth = {
                code: '_code_'
            };
            corbelDriver.iam.token().create({
                jwt: testJwt,
                oauth: testOauth
            }, true);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            console.log('callRequestParam', callRequestParam);
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.headers.RequestCookie).to.be.equal('true');
        });

        it('Using Oauth correctly', function() {
            var testJwt = '_jwt_';
            var testOauth = {
                code: '_code_'
            };
            corbelDriver.iam.token().create({
                jwt: testJwt,
                oauth: testOauth
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(decodeURIComponent(callRequestParam.query)).to.be.equal('assertion=' + testJwt + '&grant_type=' + corbel.Iam.GRANT_TYPE + '&code=' + testOauth.code);
        });
    });

    describe('Refresh accessToken', function() {

        it('Using without refresh token', function() {
            expect(corbelDriver.iam.token().refresh).to.
            throw('Refresh access token request must contains refresh token');
        });

        it('Using refresh token correctly with default scopes', function() {
            sandbox.stub(corbel.jwt, '_generateExp').returns(1234);
            corbelDriver.iam.token().refresh('refresh_token');
            var testJwt = corbel.jwt.generate({
                iss: CONFIG.clientId,
                aud: CONFIG.audience,
                exp: 1234,
                scope: CONFIG.scopes,
                'refresh_token': 'refresh_token'
            }, CONFIG.clientSecret);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        it('Using refresh token correctly with scopes', function() {
            sandbox.stub(corbel.jwt, '_generateExp').returns(1234);
            corbelDriver.iam.token().refresh('refresh_token', 'test_scope');
            var claims = {
                'refresh_token': 'refresh_token'
            };
            claims.scope = 'test_scope';
            claims.exp = 1234;
            var testJwt = corbel.jwt.generate({
                iss: CONFIG.clientId,
                aud: CONFIG.audience,
                exp: 1234,
                scope: 'test_scope',
                'refresh_token': 'refresh_token'
            }, CONFIG.clientSecret);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });
    });

    describe('usernames availability', function() {
        
        var domainId = 'test-domain';
        
        it('get username availability', function() {
            var USERNAME = 'test';
            corbelDriver.domain(domainId).iam.username().availability(USERNAME);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/username/' + USERNAME);
            expect(callRequestParam.method).to.be.equal('HEAD');
        });

        it('get username availability with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.username().availability();
          }).to.throw('username value is mandatory and cannot be undefined');
        });

        it('username available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                status: 404
            }));
            corbelDriver.domain(domainId).iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(true);
                done();
            });
        });

        it('username not available return false', function(done) {
            corbelDriver.domain(domainId).iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(false);
                done();
            });
        });

        it('on server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            corbelDriver.domain(domainId).iam.username().availability('test').catch(function() {
                done();
            });
        });
        
    });

    describe('Email availability', function() {
        
        var domainId = 'test-domain';
        
        it('Get email availability', function() {
            var EMAIL = 'test@test.com';
            corbelDriver.domain(domainId).iam.email().availability(EMAIL);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/email/' + EMAIL);
            expect(callRequestParam.method).to.be.equal('HEAD');
        });

        it('Get email availability with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.email().availability();
          }).to.throw('email value is mandatory and cannot be undefined');
        });

        it('Email available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                status: 404
            }));
            corbelDriver.domain(domainId).iam.email().availability('test@domingo.com').then(function(result) {
                expect(result).to.be.equal(true);
                done();
            });
        });

        it('Email not available return false', function(done) {
            corbelDriver.domain(domainId).iam.email().availability('test@test.com').then(function(result) {
                expect(result).to.be.equal(false);
                done();
            });
        });

        it('On server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            corbelDriver.domain(domainId).iam.email().availability('test').catch(function() {
                done();
            });
        });
    });

    describe('Users Management', function() {
        
        var domainId = 'test-domain';

        it('Create user', function() {
            var username = 'username';
            corbelDriver.domain(domainId).iam.users().create({
                username: username
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Get all users', function() {
            corbelDriver.domain(domainId).iam.users().get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user me', function() {
            corbelDriver.domain(domainId).iam.user('me').get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user', function() {
            corbelDriver.domain(domainId).iam.user('userId').get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update user', function() {
            var username = 'username';
            corbelDriver.domain(domainId).iam.user('userId').update({
                username: username
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Update user using me', function() {
            var username = 'username';
            corbelDriver.domain(domainId).iam.user('me').update({
                username: username
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Update user me', function() {
            var username = 'username';
            corbelDriver.domain(domainId).iam.user().updateMe({
                username: username
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Delete user', function() {
            corbelDriver.domain(domainId).iam.user('userId').delete();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user using me', function() {
            corbelDriver.domain(domainId).iam.user('me').delete();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user me', function() {
            corbelDriver.domain(domainId).iam.user().deleteMe();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Sign Out user using me', function() {
            corbelDriver.domain(domainId).iam.user('me').signOut();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Sign Out user me', function() {
            corbelDriver.domain(domainId).iam.user().signOutMe();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user', function() {
            corbelDriver.domain(domainId).iam.user('userId').disconnect();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user logged', function() {
            corbelDriver.domain(domainId).iam.user('me').disconnect();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect me', function() {
            corbelDriver.domain(domainId).iam.user().disconnectMe();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Get logged user current session', function() {
            corbelDriver.domain(domainId).iam.user().getMySession();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/session');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Close all user sessions', function() {
            corbelDriver.domain(domainId).iam.user('userId').closeSessions();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/sessions');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Close all user logged sessions', function() {
            corbelDriver.domain(domainId).iam.user('me').closeSessions();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/sessions');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Close all my sessions', function() {
            corbelDriver.domain(domainId).iam.user().closeSessionsMe();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/sessions');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Generate sendResetPasswordEmail request correctly', function() {
            corbelDriver.domain(domainId).iam.users().sendResetPasswordEmail('test@email.com');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/resetPassword?email=test@email.com');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        describe('Adding user identity', function() {
            
            var domainId = 'test-domain';
            
            it('with valid identity object', function() {
                corbelDriver.domain(domainId).iam.user('userId').addIdentity({
                    oAuthService: 'silkroad',
                    oAuthId: '12435'
                });
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/identity');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(callRequestParam.data.oAuthService).to.be.equal('silkroad');
                expect(callRequestParam.data.oAuthId).to.be.equal('12435');
            });

            it('without passing an identity object', function() {
                expect(corbelDriver.domain(domainId).iam.user('userId').addIdentity).to.
                throw('Missing identity');
            });
        });

        it('Get user identities', function() {
            corbelDriver.domain(domainId).iam.user('userId').getIdentities();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user identities using me', function() {
            corbelDriver.domain(domainId).iam.user('me').getIdentities();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my identities', function() {
            corbelDriver.domain(domainId).iam.user().getMyIdentities();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile using me', function() {
            corbelDriver.domain(domainId).iam.user('me').getProfile();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my profile', function() {
            corbelDriver.domain(domainId).iam.user().getMyProfile();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile', function() {
            corbelDriver.domain(domainId).iam.user('userId').getProfile();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profiles', function() {
            corbelDriver.domain(domainId).iam.users().getProfiles();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

    });

    describe('User devices', function() {
        
        var domainId = 'test-domain';

        it('Register my device', function() {
            corbelDriver.domain(domainId).iam.user().registerMyDevice('deviceId', 'Device data');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/deviceId');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device', function() {
            corbelDriver.domain(domainId).iam.user('userId').registerDevice('deviceId', 'Device data');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/device/deviceId');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device using me', function() {
            corbelDriver.domain(domainId).iam.user('me').registerDevice('deviceId', 'Device data');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/deviceId');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Get device id', function() {
            corbelDriver.domain(domainId).iam.user('userId').getDevice('deviceId');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/device/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get device id using me', function() {
            corbelDriver.domain(domainId).iam.user('me').getDevice('deviceId');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get  my device id', function() {
            corbelDriver.domain(domainId).iam.user().getMyDevice('deviceId');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices', function() {
            corbelDriver.domain(domainId).iam.user('userId').getDevices();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/device');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices with params', function() {
            var params = {
                query: {'$eq': {
                  test: 3
                }
              }
            };
            corbelDriver.domain(domainId).iam.user('userId').getDevices(params);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/device?api:query=%7B%22%24eq%22%3A%7B%22test%22%3A3%7D%7D');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices using me', function() {
            corbelDriver.domain(domainId).iam.user('me').getDevices();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my devices', function() {
            corbelDriver.domain(domainId).iam.user().getMyDevices();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my device', function() {
            corbelDriver.domain(domainId).iam.user('me').getDevice('123');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/123');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Delete my device', function() {
            corbelDriver.domain(domainId).iam.user('me').deleteDevice('deviceId');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/device/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete device', function() {
            corbelDriver.domain(domainId).iam.user('123').deleteDevice('deviceId');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/123/device/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

    });

    describe('User groups', function() {
        
        var domainId = 'test-domain';

        it('Add groups to user', function() {
            var groups = ['g1', 'g2'];
            corbelDriver.domain(domainId).iam.user('userId').addGroups(groups);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/groups');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Delete group to user', function() {
            corbelDriver.domain(domainId).iam.user('userId').deleteGroup('g1');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/userId/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete group my group using me', function() {
            corbelDriver.domain(domainId).iam.user('me').deleteGroup('g1');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete my group', function() {
            corbelDriver.domain(domainId).iam.user().deleteMyGroup('g1');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/user/me/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

    });

    describe('Domain admin interface', function() {
        
        var domainId = 'test-domain';
        
        var data = {
            id: 'jklasdfjklasdf'
        };

        it('Create a new domain', function() {
            corbelDriver.domain(domainId).iam.domain().create(data).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/domain');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(data.id).to.be.equal(id);
            });
        });

        it('Gets a domain', function() {
            corbelDriver.domain(domainId).iam.domain().get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/domain');
            expect(callRequestParam.method).to.be.equal('GET');
        });


        it('Gets all domains', function() {
            corbelDriver.domain(domainId).iam.domain().getAll();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/domain/all');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a domain', function() {
            corbelDriver.domain(domainId).iam.domain().update(data);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/domain');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove a domain', function() {
            corbelDriver.domain(domainId).iam.domain().remove();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/domain');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Create a new client', function() {
            corbelDriver.domain(domainId).iam.client().create(data).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/client');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(data.id).to.be.equal(id);
            });
        });

        it('Get a client', function() {
            corbelDriver.domain(domainId).iam.client(data.id).get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get a client with undefined clientId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.client(undefined).get();
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

         it('Get all clients in a domain', function() {
            corbelDriver.domain(domainId).iam.client().getAll();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/client');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a client', function() {
            corbelDriver.domain(domainId).iam.client(data.id).update(data);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Update a new client with undefined clientId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.client(undefined).update({});
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

        it('Remove a client', function() {
            corbelDriver.domain(domainId).iam.client(data.id).remove();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Remove a new client with undefined clientId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.client(undefined).remove({});
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

    });

    describe('Scope admin interface', function() {
        
        var domainId = 'test-domain';
        
        it('Create a new scope', function() {           
            var scope = {
                id: 'jklsdfbnwerj'
            };
            corbelDriver.domain(domainId).iam.scope().create(scope).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/scope');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(scope.id).to.be.equal(id);
            });
        });
        
        it('Create a scope with identifier', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.scope('scopeId').create({});
          }).to.throw('This function not allowed scope identifier');
        });

        it('Get a scope', function() {
            var scopeId = 'jklsdfbnwerj';
            corbelDriver.domain(domainId).iam.scope(scopeId).get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get a scope with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.scope().get();
          }).to.throw('id value is mandatory and cannot be undefined');
        });

        it('Remove a scope', function() {
            var scopeId = 'jklsdfbnwerj';
            corbelDriver.domain(domainId).iam.scope(scopeId).remove();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Remove a scope with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.domain(domainId).iam.scope().remove();
          }).to.throw('id value is mandatory and cannot be undefined');
        });
    });

    describe('Groups api interface', function() {
        
        var domainId = 'test-domain';
        
        it('Get all groups', function() {
            corbelDriver.domain(domainId).iam.group().getAll();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get a group', function() {
            var id = 'id';
            corbelDriver.domain(domainId).iam.group(id).get();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group/' + id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Create a group', function() {
            var group = {
                name: 'name',
                scopes: ['scope1', 'scope2']
            };
            corbelDriver.domain(domainId).iam.group().create(group);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group');
            expect(callRequestParam.method).to.be.equal('POST');
        });

        it('Add scopes to a group', function() {
            var id = 'id';
            corbelDriver.domain(domainId).iam.group(id).addScopes(['scope1']);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group/' + id + '/scopes');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove scopes from a group', function() {
            var id = 'id';
            var scopeToRemove = 'scope1';
            corbelDriver.domain(domainId).iam.group(id).removeScope(scopeToRemove);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group/' + id + '/scopes/' + scopeToRemove);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete a group', function() {
            var id = 'id';
            corbelDriver.domain(domainId).iam.group(id).delete();
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + domainId + '/group/' + id);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });
    });
});
