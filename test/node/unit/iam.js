'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

var TEST_ENDPOINT = 'http://iam.io/',
    CLIENT_SECRET = 'secret';

describe('corbel IAM module', function() {

    var sandbox = sinon.sandbox.create();

    var backupCFG,
        corbelRequestStub;

    before(function() {
        backupCFG = corbel.common.getConfig();
        corbel.common.setConfig({
            iamEndpoint: TEST_ENDPOINT,
            clientSecret: CLIENT_SECRET
        });
    });

    after(function() {
        corbel.common.setConfig(backupCFG);
    });

    beforeEach(function() {
        corbelRequestStub = sandbox.stub(corbel.request, 'send').returns(Promise.resolve());
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Creates accessToken', function() {

        it('Using without params', function() {
            expect(corbel.iam.token().create).to.
            throw('Create token request must contains params');
        });

        it('Using with empty params', function() {
            var caller = function() {
                corbel.iam.token().create({});
            };
            expect(caller).to.
            throw('Create token request must contains either jwt or claims parameter');
        });

        it('Using with bad params', function() {
            var badParams = {
                badParams: 'badParams'
            };
            var caller = function() {
                corbel.iam.token().create(badParams);
            };
            expect(caller).to.
            throw('Create token request must contains either jwt or claims parameter');
        });

        it('Using JWT correctly', function() {
            var testJwt = '_jwt_';
            corbel.iam.token().create({
                jwt: testJwt
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.iam.GRANT_TYPE);
        });

        it('Using claims correctly', function() {

            var testClaims = {
                iss: 'clientId',
                scope: 'scopes',
                aud: 'audience',
                exp: 'expireAt',
                prn: 'principal'
            };

            var assertion = corbel.jwt.generate(testClaims, CLIENT_SECRET);

            corbel.iam.token().create({
                claims: testClaims
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(assertion);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.iam.GRANT_TYPE);
        });

        it('Getting token with cookie with POST', function() {

            var testClaims = {
                iss: 'clientId',
                scope: 'scopes',
                aud: 'audience',
                exp: 'expireAt',
                prn: 'principal'
            };

            corbel.iam.token().create({
                claims: testClaims
            }, true);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.headers.RequestCookie).to.be.equal('true');
        });

        it('Getting token with cookie with GET', function() {
            var testJwt = '_jwt_';
            var testOauth = {
                code: '_code_'
            };
            corbel.iam.token().create({
                jwt: testJwt,
                oauth: testOauth
            }, true);
            var callRequestParam = corbel.request.send.firstCall.args[0];
            console.log('callRequestParam', callRequestParam);
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.headers.RequestCookie).to.be.equal('true');
        });

        it('Using Oauth correctly', function() {
            var testJwt = '_jwt_';
            var testOauth = {
                code: '_code_'
            };
            corbel.iam.token().create({
                jwt: testJwt,
                oauth: testOauth
            });
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(decodeURIComponent(callRequestParam.query)).to.be.equal('assertion=' + testJwt + '&grant_type=' + corbel.iam.GRANT_TYPE + '&code=' + testOauth.code);
        });
    });

    describe('Refresh accessToken', function() {

        it('Using without refresh token', function() {
            expect(corbel.iam.token().refresh).to.
            throw('Refresh access token request must contains refresh token');
        });

        it.only('Using refresh token correctly with default scopes', function() {

            corbel.iam.token().refresh('refresh_token');

            var testJwt = corbel.jwt.generate(corbel.jwt.createClaims({
                iss: 'clientId',
                scope: 'scopes',
                aud: 'audience',
                'refresh_token': 'refresh_token'
            }));

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.iam.GRANT_TYPE);
        });

        it('Using refresh token correctly with scopes', function() {

            corbel.iam.token().refresh('refresh_token', 'test_scope');

            var claims = corbel.jwt.createClaims({
                'refresh_token': 'refresh_token'
            });
            claims.scope = 'test_scope';
            var testJwt = corbel.jwt.generate(claims);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'oauth/token');
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.assertion).to.be.equal(testJwt);
            expect(callRequestParam.data.grant_type).to.be.equal(corbel.iam.GRANT_TYPE);
        });
    });

    describe('Users availability', function() {
        it('Get username availability', function() {
            var USERNAME = 'test';
            corbel.iam.username().availability(USERNAME);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'username/' + USERNAME);
            expect(callRequestParam.method).to.be.equal('HEAD');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('Username available return true', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 404
            }));
            expect(corbel.iam.username().availability('test')).
            to.eventually.be.fulfilled.
            then(function(result) {
                expect(result).to.be.to.be.equal(true);
            }).
            should.notify(done);
        });

        it('Username not available return false', function(done) {
            expect(corbel.iam.username().availability('test')).
            to.eventually.be.fulfilled.
            then(function(result) {
                expect(result).to.be.to.be.equal(false);
            }).
            should.notify(done);
        });

        it('On server error reject promise', function(done) {
            corbelRequestStub.returns(Promise.reject({
                httpStatus: 500
            }));
            expect(corbel.iam.username().availability('test')).
            to.eventually.be.rejected.
            and.notify(done);
        });

    });

    describe('Users Management', function() {

        it('Create user', function() {
            var username = 'username';
            corbel.iam.user().create({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user');
            expect(callRequestParam.withAuth).to.be.equal(true);
            expect(callRequestParam.method).to.be.equal('POST');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Get all users', function() {
            corbel.iam.user().get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('Get user me', function() {
            corbel.iam.user().getMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user', function() {
            corbel.iam.user('userId').get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update user', function() {
            var username = 'username';

            corbel.iam.user('userId').update({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Update user me', function() {
            var username = 'username';

            corbel.iam.user().updateMe({
                username: username
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            expect(callRequestParam.data.username).to.be.equal(username);
        });

        it('Delete user', function() {

            corbel.iam.user('userId').delete();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete user me', function() {

            corbel.iam.user().deleteMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });


        it('Sign Out user me', function() {

            corbel.iam.user().signOutMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/signout');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user', function() {

            corbel.iam.user('userId').disconnect();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Disconnect user logged', function() {

            corbel.iam.user().disconnectMe();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/disconnect');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('generate sendResetPasswordEmail request correctly', function() {
            corbel.iam.user().sendResetPasswordEmail('test@email.com');
            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/resetPassword');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.query).to.be.equal('email=test@email.com');
        });

        describe('Adding user identity', function() {
            it('with valid identity object', function() {

                corbel.iam.user('userId').addIdentity({
                    oAuthService: 'silkroad',
                    oAuthId: '12435'
                });

                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/identity');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(callRequestParam.data.oAuthService).to.be.equal('silkroad');
                expect(callRequestParam.data.oAuthId).to.be.equal('12435');
            });

            it('without passing an identity object', function() {
                expect(corbel.iam.user('userId').addIdentity).to.
                throw('Missing identity');
            });
        });
        it('Get user identities', function() {
            corbel.iam.user('userId').getIdentities();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/identity');
            expect(callRequestParam.method).to.be.equal('GET');
        });



        it('Get user profile me', function() {
            corbel.iam.user().getMeProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profile', function() {
            corbel.iam.user('userId').getProfile();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get user profiles', function() {
            corbel.iam.user().getProfiles();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/profile');
            expect(callRequestParam.method).to.be.equal('GET');
        });

    });

    describe('User devices', function() {

        it('Register my device', function() {
            corbel.iam.user().registerMyDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Register device', function() {
            corbel.iam.user('userId').registerDevice('Device data');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/devices');
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Get device id', function() {
            corbel.iam.user('userId').getDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get devices', function() {
            corbel.iam.user('userId').getDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/userId/devices/');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my devices', function() {
            corbel.iam.user().getMyDevices();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/devices');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Get my device', function() {
            corbel.iam.user().getMyDevice('123');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/devices/123');
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Delete my device', function() {
            corbel.iam.user().deleteMyDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/me/devices/deviceId');
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Delete device', function() {
            corbel.iam.user('123').deleteDevice('deviceId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'user/123/devices/deviceId');
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
            corbel.iam.domain().create(domain).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(domain.id).to.be.equal(id);
            });
        });

        it('Gets a domain', function() {
            var domain = getEntity();
            corbel.iam.domain(domain.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + domain.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a domain', function() {
            var domain = getEntity();
            corbel.iam.domain(domain.id).update(domain);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + domain.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove a domain', function() {
            var domainId = 'sjdfkls';
            corbel.iam.domain(domainId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + domainId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

        it('Create a new client', function() {
            var client = getEntity();
            corbel.iam.client(client.domain).create(client).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + client.domain + '/client');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(client.id).to.be.equal(id);
            });
        });

        it('Get a client', function() {
            var client = getEntity();
            corbel.iam.client(client.domain, client.id).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Update a client', function() {
            var client = getEntity();
            corbel.iam.client(client.domain, client.id).update(client);

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('PUT');
        });

        it('Remove a client', function() {
            var client = getEntity();
            corbel.iam.client(client.domain, client.id).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'domain/' + client.domain + '/client/' + client.id);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });

    });

    describe('Scope admin interface', function() {
        it('Create a new scope', function() {
            var scope = {
                id: 'jklsdfbnwerj'
            };

            corbel.iam.scope().create(scope).
            then(function(id) {
                var callRequestParam = corbel.request.send.firstCall.args[0];
                expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'scope');
                expect(callRequestParam.method).to.be.equal('POST');
                expect(scope.id).to.be.equal(id);
            });
        });

        it('Get a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbel.iam.scope(scopeId).get();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('GET');
        });

        it('Remove a scope', function() {
            var scopeId = 'jklsdfbnwerj';

            corbel.iam.scope(scopeId).remove();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'scope/' + scopeId);
            expect(callRequestParam.method).to.be.equal('DELETE');
        });
    });
});
