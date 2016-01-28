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
        it('get username availability', function() {
            var USERNAME = 'test';
            corbelDriver.iam.username().availability(USERNAME);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'username/' + USERNAME);
            expect(callRequestParam.method).to.be.equal('HEAD');
        });

        it('get username availability with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.username().availability();
          }).to.throw('username value is mandatory and cannot be undefined');
        });

        it('username available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                status: 404
            }));
            corbelDriver.iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(true);
                done();
            });
        });

        it('username not available return false', function(done) {
            corbelDriver.iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(false);
                done();
            });
        });

        it('on server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            corbelDriver.iam.username().availability('test').catch(function() {
                done();
            });
        });

    });

    describe('Email availability', function() {
        it('Get email availability', function() {
            var EMAIL = 'test@test.com';
            corbelDriver.iam.email().availability(EMAIL);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'email/' + EMAIL);
            expect(callRequestParam.method).to.be.equal('HEAD');
        });

        it('get email availability with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.email().availability();
          }).to.throw('email value is mandatory and cannot be undefined');
        });

        it('Email available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                status: 404
            }));
            corbelDriver.iam.email().availability('test@domingo.com').then(function(result) {
                expect(result).to.be.equal(true);
                done();
            });
        });

        it('Email not available return false', function(done) {
            corbelDriver.iam.email().availability('test@test.com').then(function(result) {
                expect(result).to.be.equal(false);
                done();
            });
        });

        it('On server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            corbelDriver.iam.email().availability('test').catch(function() {
                done();
            });
        });
    });

    describe('Users Management', function() {

        it('Create user', function() {
            var username = 'username';
            corbelDriver.iam.users().create({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Get all users', function() {
            corbelDriver.iam.users().get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user me', function() {
            corbelDriver.iam.user('me').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user', function() {
            corbelDriver.iam.user('userId').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update user', function() {
            var username = 'username';

            corbelDriver.iam.user('userId').update({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Update user using me', function() {
            var username = 'username';

            corbelDriver.iam.user('me').update({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Update user me', function() {
            var username = 'username';

            corbelDriver.iam.user().updateMe({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(JSON.stringify(callRequestParam.data)).to.be.equal('{"username":"username"}');
        });

        it('Delete user', function() {
            corbelDriver.iam.user('userId').delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user using me', function() {
            corbelDriver.iam.user('me').delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user me', function() {

            corbelDriver.iam.user().deleteMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Sign Out user using me', function() {

            corbelDriver.iam.user('me').signOut();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Sign Out user me', function() {

            corbelDriver.iam.user().signOutMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user', function() {

            corbelDriver.iam.user('userId').disconnect();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user logged', function() {

            corbelDriver.iam.user('me').disconnect();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect me', function() {

            corbelDriver.iam.user().disconnectMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('generate sendResetPasswordEmail request correctly', function() {
            corbelDriver.iam.users().sendResetPasswordEmail('test@email.com');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/resetPassword?email=test@email.com');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        describe('Adding user identity', function() {
            it('with valid identity object', function() {

                corbelDriver.iam.user('userId').addIdentity({
                    oAuthService: 'silkroad',
                    oAuthId: '12435'
                });

                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/identity');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(callRequestParam.data.oAuthService).to.be.equal('silkroad');
                expect(callRequestParam.data.oAuthId).to.be.equal('12435');
            });

            it('without passing an identity object', function() {
                expect(corbelDriver.iam.user('userId').addIdentity).to.
                throw('Missing identity');
            });
        });

        it('Get user identities', function() {
            corbelDriver.iam.user('userId').getIdentities();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user identities using me', function() {
            corbelDriver.iam.user('me').getIdentities();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my identities', function() {
            corbelDriver.iam.user().getMyIdentities();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile using me', function() {
            corbelDriver.iam.user('me').getProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my profile', function() {
            corbelDriver.iam.user().getMyProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile', function() {
            corbelDriver.iam.user('userId').getProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profiles', function() {
            corbelDriver.iam.users().getProfiles();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

    });

    describe('User devices', function() {

        it('Register my device', function() {
            corbelDriver.iam.user().registerMyDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device', function() {
            corbelDriver.iam.user('userId').registerDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device using me', function() {
            corbelDriver.iam.user('me').registerDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Get device id', function() {
            corbelDriver.iam.user('userId').getDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get device id using me', function() {
            corbelDriver.iam.user('me').getDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get  my device id', function() {
            corbelDriver.iam.user().getMyDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices', function() {
            corbelDriver.iam.user('userId').getDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices using me', function() {
            corbelDriver.iam.user('me').getDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });


        it('Get my devices', function() {
            corbelDriver.iam.user().getMyDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my device', function() {
            corbelDriver.iam.user('me').getDevice('123');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/123');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Delete my device', function() {
            corbelDriver.iam.user('me').deleteDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete device', function() {
            corbelDriver.iam.user('123').deleteDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/123/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });


    });

    describe('User groups', function() {

        it('Add groups to user', function() {
            var groups = ['g1', 'g2'];

            corbelDriver.iam.user('userId').addGroups(groups);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/groups');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('delete group to user', function() {
            corbelDriver.iam.user('userId').deleteGroup('g1');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/userId/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('delete group my group using me', function() {
            corbelDriver.iam.user('me').deleteGroup('g1');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('delete my group', function() {
            corbelDriver.iam.user().deleteMyGroup('g1');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'user/me/groups/g1');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

    });

    describe('Domain admin interface', function() {
        var data = {
            id: 'jklasdfjklasdf',
            domain: 'wenuirasdj'
        };

        it('Create a new domain', function() {
            corbelDriver.iam.domain().create(data).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(data.id).to.be.equal(id);
            });
        });

        it('get a domain with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.domain().get();
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('Gets a domain', function() {
            corbelDriver.iam.domain(data.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });


        it('Gets all domains', function() {
            corbelDriver.iam.domain().getAll();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a domain', function() {
            corbelDriver.iam.domain(data.id).update(data);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('update a domain with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.domain().update({});
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('Remove a domain', function() {
            var domainId = 'sjdfkls';
            corbelDriver.iam.domain(domainId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + domainId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('remove a domain with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.domain().remove();
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('Create a new client', function() {
            corbelDriver.iam.client(data.domain).create(data).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.domain + '/client');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(data.id).to.be.equal(id);
            });
        });

        it('Create a new client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client(undefined, 'clientId').create({});
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('Get a client', function() {
            corbelDriver.iam.client(data.domain, data.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.domain + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('get a client with undefined clientId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client(data.domain, undefined).get();
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

        it('get a client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client(undefined, 'clientId').get();
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

         it('Get all clients in a domain', function() {
            corbelDriver.iam.client(data.domain).getAll();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.domain + '/client');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a client', function() {
            corbelDriver.iam.client(data.domain, data.id).update(data);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.domain + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('update a new client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client(undefined, 'clientId').update({});
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('update a new client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client('domainId', undefined).update({});
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

        it('Remove a client', function() {
            corbelDriver.iam.client(data.domain, data.id).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'domain/' + data.domain + '/client/' + data.id);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('remove a new client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client(undefined, 'clientId').remove({});
          }).to.throw('domainId value is mandatory and cannot be undefined');
        });

        it('remove a new client with undefined domainId', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.client('domainId', undefined).remove({});
          }).to.throw('clientId value is mandatory and cannot be undefined');
        });

    });

    describe('Scope admin interface', function() {
        it('Create a new scope', function() {
            var scope = {
                id: 'jklsdfbnwerj'
            };

            corbelDriver.iam.scope().create(scope).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'scope');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(scope.id).to.be.equal(id);
            });
        });

        it('Get a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbelDriver.iam.scope(scopeId).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('get a scope with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.scope().get();
          }).to.throw('id value is mandatory and cannot be undefined');
        });

        it('Remove a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbelDriver.iam.scope(scopeId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('remove a scope with undefined value', function() {
          corbelRequestStub.returns(Promise.resolve('OK'));
          expect(function(){
            corbelDriver.iam.scope().remove();
          }).to.throw('id value is mandatory and cannot be undefined');
        });
    });

    describe('Groups api interface', function() {
        it('Get all groups', function() {
            corbelDriver.iam.group().getAll();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get a group', function() {
            var id = 'id';

            corbelDriver.iam.group(id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group/' + id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Create a group', function() {
            var group = {
                name: 'name',
            scopes: ['scope1', 'scope2']
            };

            corbelDriver.iam.group().create(group);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group');
            expect(callRequestParam.method).to.be.equal('POST');
        });

        it('Add scopes to a group', function() {
            var id = 'id';

            corbelDriver.iam.group(id).addScopes(['scope1']);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group/' + id + '/scopes');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove scopes from a group', function() {
            var id = 'id';
            var scopeToRemove = 'scope1';

            corbelDriver.iam.group(id).removeScope(scopeToRemove);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group/' + id + '/scopes/' + scopeToRemove);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete a group', function() {
            var id = 'id';

            corbelDriver.iam.group(id).delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(IAM_END_POINT + 'group/' + id);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });
    });
});
