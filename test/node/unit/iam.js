'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;


describe('corbel IAM module', function() {

    var sandbox = sinon.sandbox.create();
    //var TEST_ACCESS_TOKEN = 'token';
    var CONFIG = {
        urlBase: 'url',

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopesApp: 'scopesApp',
        scopesUserLogin: 'scopesUserLogin',
        scopesUserCreate: 'scopesUserCreate',

        resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
        iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
        evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
        oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',

        oauthClientId: 'bitbloq-client',
        oauthSecret: 'bitbloq-secret',
        oauthService: 'corbel'
    };

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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(assertion);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });

        it('Using JWT correctly', function() {
            var testJwt = '_jwt_';
            corbelDriver.iam.token().create({
                jwt: testJwt
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
                aud: corbel.Iam.AUD,
                exp: 1234,
                scope: CONFIG.scopesApp,
                'refresh_token': 'refresh_token'
            }, CONFIG.clientSecret);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
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
                aud: corbel.Iam.AUD,
                exp: 1234,
                scope: 'test_scope',
                'refresh_token': 'refresh_token'
            }, CONFIG.clientSecret);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.Iam.GRANT_TYPE);
        });
    });

    describe('Users availability', function() {
        it('Get username availability', function() {
            var USERNAME = 'test';
            corbelDriver.iam.username().availability(USERNAME);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'username/' + USERNAME);
            expect(callRequestParam.method).to.be.equal('HEAD');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('Username available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                status: 404
            }));
            corbelDriver.iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(true);
                done();
            });
        });

        it('Username not available return false', function(done) {
            corbelDriver.iam.username().availability('test').then(function(result) {
                expect(result).to.be.equal(false);
                done();
            });
        });

        it('On server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            corbelDriver.iam.username().availability('test').catch(function() {
                done();
            });
        });

    });

    describe('Users Management', function() {

        it('Create user', function() {
            var username = 'username';
            corbelDriver.iam.user().create({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user');
            expect(callRequestParam.withAuth).to.be.equal(true);
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Get all users', function() {
            corbelDriver.iam.user().get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('Get user me', function() {
            corbelDriver.iam.user('me').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user', function() {
            corbelDriver.iam.user('userId').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update user', function() {
            var username = 'username';

            corbelDriver.iam.user('userId').update({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Update user me', function() {
            var username = 'username';

            corbelDriver.iam.user('me').update({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Delete user', function() {

            corbelDriver.iam.user('userId').delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user me', function() {

            corbelDriver.iam.user('me').delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });


        it('Sign Out user me', function() {

            corbelDriver.iam.user('me').signOut();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user', function() {

            corbelDriver.iam.user('userId').disconnect();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user logged', function() {

            corbelDriver.iam.user('me').disconnect();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('generate sendResetPasswordEmail request correctly', function() {
            corbelDriver.iam.user().sendResetPasswordEmail('test@email.com');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/resetPassword');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.query).to.be.equal('email=test@email.com');
        });

        describe('Adding user identity', function() {
            it('with valid identity object', function() {

                corbelDriver.iam.user('userId').addIdentity({
                    oAuthService: 'silkroad',
                    oAuthId: '12435'
                });

                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/identity');
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
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile me', function() {
            corbelDriver.iam.user('me').getProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile', function() {
            corbelDriver.iam.user('userId').getProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profiles', function() {
            corbelDriver.iam.user().getProfiles();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

    });

    describe('User devices', function() {

        it('Register my device', function() {
            corbelDriver.iam.user('me').registerDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device', function() {
            corbelDriver.iam.user('userId').registerDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Get device id', function() {
            corbelDriver.iam.user('userId').getDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices', function() {
            corbelDriver.iam.user('userId').getDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/userId/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my devices', function() {
            corbelDriver.iam.user('me').getDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my device', function() {
            corbelDriver.iam.user('me').getDevice('123');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/devices/123');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Delete my device', function() {
            corbelDriver.iam.user('me').deleteDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/me/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete device', function() {
            corbelDriver.iam.user('123').deleteDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'user/123/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });


    });

    describe('Domain admin interface', function() {
        function getEntity() {
            var entity = {
                id: 'jklasdfjklasdf',
                domain: 'wenuirasdj'
            };
            return entity;
        }

        it('Create a new domain', function() {
            var domain = getEntity();
            corbelDriver.iam.domain().create(domain).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(domain.id).to.be.equal(id);
            });
        });

        it('Gets a domain', function() {
            var domain = getEntity();
            corbelDriver.iam.domain(domain.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + domain.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a domain', function() {
            var domain = getEntity();
            corbelDriver.iam.domain(domain.id).update(domain);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + domain.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove a domain', function() {
            var domainId = 'sjdfkls';
            corbelDriver.iam.domain(domainId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + domainId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Create a new client', function() {
            var client = getEntity();
            corbelDriver.iam.client(client.domain).create(client).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + client.domain + '/client');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(client.id).to.be.equal(id);
            });
        });

        it('Get a client', function() {
            var client = getEntity();
            corbelDriver.iam.client(client.domain, client.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a client', function() {
            var client = getEntity();
            corbelDriver.iam.client(client.domain, client.id).update(client);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove a client', function() {
            var client = getEntity();
            corbelDriver.iam.client(client.domain, client.id).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('DELETE');
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
                expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'scope');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(scope.id).to.be.equal(id);
            });
        });

        it('Get a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbelDriver.iam.scope(scopeId).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Remove a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbelDriver.iam.scope(scopeId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(CONFIG.iamEndpoint + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });
    });
});
