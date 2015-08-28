'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

describe('In OAUTH module', function() {

    var sandbox = sinon.sandbox.create(),
        corbelDriver,
        oauth;

    var CONFIG = {

        clientId: 'clientId',
        clientSecret: 'clientSecret',
        scopes: ['silkroad-qa:client', 'resources:send_event_bus', 'resources:test:test_operations', 'resources:music:read_catalog', 'resources:music:streaming'],
        urlBase: 'https://{{module}}-corbel.io/'
    };

    var OAUTH_URL = CONFIG.urlBase.replace('{{module}}', 'oauth') + 'oauth/';

    before(function() {
        corbelDriver = corbel.getDriver(CONFIG);
        oauth = corbelDriver.oauth;
    });

    beforeEach(function() {
        sandbox.stub(corbel.request, 'send').returns(Promise.resolve());
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('with authorization endpoint,', function() {
        it('do login request correctly', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                responseType: 'code'
            };

            oauth.authorization(clientParams).login('testUser', 'testPassword');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'authorize');
            expect(callRequestParam.method).to.be.equal('POST');
            var response = callRequestParam.data;
            expect(response).to.have.a.property('username', 'testUser');
            expect(response).to.have.a.property('password', 'testPassword');
        });

        it('do the login with cookie request correctly', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                responseType: 'code'
            };

            oauth.authorization(clientParams).loginWithCookie();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'authorize');
            expect(callRequestParam.method).to.be.equal('GET');
            var response = callRequestParam.data;
            expect(response.contentType).to.be.equal(corbel.Oauth._URL_ENCODED);
            expect(response.data).to.have.a.property('client_id', 'testClient');
            expect(response.data).to.have.a.property('response_type', 'code');
            expect(response.data).to.have.a.property('redirect_uri', 'redirectUri');
        });

        it('do not allow a response type disctint to "code"', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                responseType: 'other'
            };

            expect(oauth.authorization.bind(corbelDriver.oauth.authorization, clientParams)).to.
            throw('Only "code" or "token" response type allowed');
        });

        it('fails with missing params', function() {

            expect(oauth.authorization).to.
            throw('Invalid client parameters');
        });

        it('fails with incomplete params', function() {
            var clientParams = {
                clientId: 'testClient'
            };

            expect(oauth.authorization.bind(corbelDriver.oauth.authorization, clientParams)).to.
            throw('Invalid client parameters');
        });
    });

    describe('with signOut endpoint,', function() {

        it('does the sign out request correctly', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                responseType: 'code'
            };

            oauth.authorization(clientParams).signout();

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'signout');
            expect(callRequestParam.method).to.be.equal('GET');
        });
    });

    describe('with token endpoint', function() {
        it('generate token request correctly', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                clientSecret: 'testClientSecret',
                grantType: 'authorization_code'
            };

            oauth.token(clientParams).get('testCode');

            var callRequestParam = corbel.request.send.firstCall.args[0];

            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'token');
            expect(callRequestParam.method).to.be.equal('POST');
            var response = callRequestParam.data;
            expect(response.contentType).to.be.equal(corbel.Oauth._URL_ENCODED);
            expect(response.data).to.have.a.property('client_id', 'testClient');
            expect(response.data).to.have.a.property('client_secret', 'testClientSecret');
            expect(response.data).to.have.a.property('redirect_uri', 'redirectUri');
            expect(response.data).to.have.a.property('code', 'testCode');
            expect(response.data).to.have.a.property('grant_type', 'authorization_code');
        });

        it('do not allow a grant type disctint to "authorization_code"', function() {
            var clientParams = {
                clientId: 'testClient',
                redirectUri: 'redirectUri',
                clientSecret: 'testClientSecret',
                grantType: 'other'
            };
            expect(oauth.token.bind(corbelDriver.oauth.token, clientParams)).to.
            throw('Only "authorization_code" grant type is allowed');
        });

        it('fails with missing params', function() {
            expect(oauth.token).to.
            throw('Invalid client parameters');
        });

        it('fails with incomplete params', function() {
            expect(oauth.token.bind(corbelDriver.oauth.token, undefined)).to.
            throw('Invalid client parameters');
        });
    });

    describe('with user endpoint', function() {
        var clientParams = {
            clientId: 'testClient',
            clientSecret: 'testClientSecret'
        };

        it('generate create user request correctly', function() {

            oauth.user(clientParams).create({
                user: 'user'
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];

            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user');
            expect(callRequestParam.method).to.be.equal('POST');
            var response = callRequestParam.data;
            expect(response).to.have.a.property('user', 'user');
            expect(callRequestParam.headers.Authorization).to.be.equal('Basic dGVzdENsaWVudDp0ZXN0Q2xpZW50U2VjcmV0');
        });

        it('generate user me request correctly', function() {

            oauth.user(clientParams, 'testToken').get('me');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me');
            expect(callRequestParam.method).to.be.equal('GET');
            // expect(callRequestParam.accessToken).to.have.a.property('accessToken', 'testToken');
        });

        it('generate user request correctly', function() {

            oauth.user(clientParams, 'testToken').get('userId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId');
            expect(callRequestParam.method).to.be.equal('GET');
            //expect(callRequestParam.accessToken).to.have.a.property('accessToken', 'testToken');
        });

        it('generate get user profile request correctly', function() {

            oauth.user(clientParams, 'testToken').getProfile('userId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId/profile');
            expect(callRequestParam.method).to.be.equal('GET');
            //expect(callRequestParam.accessToken).to.have.a.property('accessToken', 'testToken');
        });

        it('generate get user profile me request correctly', function() {

            oauth.user(clientParams, 'testToken').getProfile('me');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me/profile');
            expect(callRequestParam.method).to.be.equal('GET');
            //expect(callRequestParam.accessToken).to.have.a.property('accessToken', 'testToken');
        });

        it('generate update me request correctly', function() {

            oauth.user(clientParams, 'testToken').update('me', {
                fieldUpdate: 'update'
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me');
            expect(callRequestParam.method).to.be.equal('PUT');
            //expect(callRequestParam.accessToken).to.be.equal('testToken');
            var response = callRequestParam.data;
            expect(response).to.have.a.property('fieldUpdate', 'update');
        });

        it('generate update request correctly', function() {

            oauth.user(clientParams, 'testToken').update('userId', {
                fieldUpdate: 'update'
            });

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId');
            expect(callRequestParam.method).to.be.equal('PUT');
            //expect(callRequestParam.accessToken).to.be.equal('testToken');
            var response = callRequestParam.data;
            expect(response).to.have.a.property('fieldUpdate', 'update');
        });

        it('generate delete me request correctly', function() {

            oauth.user(clientParams, 'testToken').delete('me');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me');
            expect(callRequestParam.method).to.be.equal('DELETE');
            // expect(callRequestParam.accessToken).to.be.equal('testToken');
        });

        it('generate delete request correctly', function() {

            oauth.user(clientParams, 'testToken').delete('userId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId');
            expect(callRequestParam.method).to.be.equal('DELETE');
            // expect(callRequestParam.accessToken).to.be.equal('testToken');
        });

        it('generate send reset password email request correctly', function() {

            oauth.user(clientParams).sendResetPasswordEmail('test@email.com');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            var spplitedResponse = callRequestParam.url.split('?');
            //expect(spplitedResponse).to.be.equal(USER_OAUTH_URL + '/resetPassword?email=test@email.com');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(spplitedResponse).to.include('email=test@email.com');
            expect(spplitedResponse).to.include(OAUTH_URL + 'user/resetPassword');

        });

        it('generate send me validate email request correctly', function() {

            oauth.user(clientParams, 'testToken').sendValidateEmail('me');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me/validate');
            expect(callRequestParam.method).to.be.equal('GET');
            // expect(callRequestParam.accessToken).to.be.equal('testToken');
        });

        it('generate send validate email request correctly', function() {

            oauth.user(clientParams, 'testToken').sendValidateEmail('userId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId/validate');
            expect(callRequestParam.method).to.be.equal('GET');
            //expect(callRequestParam.accessToken).to.be.equal('testToken');
        });

        it('generate email me confirmation request correctly', function() {

            oauth.user(clientParams, 'oneAccessTestToken').emailConfirmation('me');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/me/emailConfirmation');
            expect(callRequestParam.method).to.be.equal('PUT');
            //expect(callRequestParam.accessToken).to.be.equal('oneAccessTestToken');
        });

        it('generate email confirmation request correctly', function() {

            oauth.user(clientParams, 'oneAccessTestToken').emailConfirmation('userId');

            var callRequestParam = corbel.request.send.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(OAUTH_URL + 'user/userId/emailConfirmation');
            expect(callRequestParam.method).to.be.equal('PUT');
            //expect(callRequestParam.accessToken).to.be.equal('oneAccessTestToken');
        });
    });
});
