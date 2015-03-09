'use strict';
/* global define, console, corbel */

// define([
//     'corejs/app',
//     'corejs/engine/jwt',
//     'corejs/engine/validate',
//     'corejs/modules/corbel/services',
//     'corejs/modules/corbel/common',
//     'underscore',
//     'q'
// ], function(app, jwt, //validate, services, common, _, q) {

/**
 * A module to make iam requests.
 * @exports iam
 * @namespace
 * @memberof app.corbel
 */
var iam = corbel.iam = {};

/**
 * Creates a TokenBuilder for token requests
 * @return {iam.TokenBuilder}
 */
iam.token = function() {
    // console.log('iamInterface.token');
    return new iam.TokenBuilder();
};

/**
 * A builder for token requests
 * @class
 * @memberOf iam
 */
iam.TokenBuilder = function() {
    this.uri = 'oauth/token';
};

/**
 * Creates a token to connect with iam
 * @method
 * @memberOf iam.TokenBuilder
 * @param  {Object} params          Parameters to authorice
 * @param {String} [params.jwt]     Assertion to generate the token
 * @param {Object} [params.claims]  Claims to generate the token
 * @return {Promise}                Q promise that resolves to an AccessToken {Object} or rejects with a {@link corbelError}
 */
iam.TokenBuilder.prototype.create = function(params, setCookie) {
    // console.log('iamInterface.token.create', params);
    // we need params to create access token
    corbel.validate.isValue(params, 'Create token request must contains params');
    // if there are oauth params this mean we should do use the GET verb
    if (params.oauth) {
        return doGetTokenRequest(this.uri, params, setCookie);
    }
    // otherwise we use the traditional POST verb.
    return doPostTokenRequest(this.uri, params, setCookie);
};

/**
 * Refresh a token to connect with iam
 * @method
 * @memberOf iam.TokenBuilder
 * @param {String} [refresh_token]   Token to refresh an AccessToken
 * @param {String} [scopes]          Scopes to the AccessToken
 * @return {Promise}                 Q promise that resolves to an AccesToken {Object} or rejects with a {@link corbelError}
 */
iam.TokenBuilder.prototype.refresh = function(refreshToken, scopes) {
    // console.log('iamInterface.token.refresh', refreshToken);
    // we need refresh token to refresh access token
    corbel.validate.isValue(refreshToken, 'Refresh access token request must contains refresh token');
    // we need create default claims to refresh access token
    var params = {
        'claims': corbel.jwt.createClaims({
            'refresh_token': refreshToken
        })
    };
    if (scopes) {
        params.claims.scope = scopes;
    }
    // we use the traditional POST verb to refresh access token.
    return doPostTokenRequest(this.uri, params);
};

/**
 * Starts a user request
 * @param  {String} [id] Id of the user to perform the request
 * @return {iam.UserBuilder | iam.UsersBuilder}    The builder to create the request
 */
iam.user = function(id) {
    // console.log.debug('iamInterface.user', id);
    if (id) {
        return new UserBuilder(id);
    }
    return new corbel.UsersBuilder();
};

/**
 * Builder for creating requests of users collection
 * @class
 * @memberOf iam
 */

var UsersBuilder = iam.UsersBuilder = function() {
    this.uri = 'user';
};

/**
 * Sends a reset password email to the email address recived.
 * @method
 * @memberOf oauth.UsersBuilder
 * @param  {String} userEmailToReset The email to send the message
 * @return {Promise}                 Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.sendResetPasswordEmail = function(userEmailToReset) {
    console.log('iamInterface.users.sendResetPasswordEmail', userEmailToReset);
    var query = 'email=' + userEmailToReset;
    return corbel.services.requestXHR({
        url: buildUri(this.uri + '/resetPassword'),
        method: corbel.services.method.GET,
        query: query,
        withAuth: true
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Creates a new user.
 * @method
 * @memberOf iam.UsersBuilder
 * @param  {Object} data The user data.
 * @return {Promise}     A promise which resolves into the ID of the created user or fails with a {@link corbelError}.
 */
UsersBuilder.prototype.create = function(data) {
    console.log('iamInterface.users.create', data);
    return corbel.services.requestXHR({
        url: buildUri(this.uri),
        method: corbel.services.method.POST,
        data: data,
        withAuth: true
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Gets the logged user
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.getMe = function() {
    console.log('iamInterface.users.getMe');
    return getUser(corbel.services.method.GET, this.uri, 'me');
};

/**
 * Gets all users of the current domain
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to an {Array} of Users or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.get = function(params) {
    console.log('iamInterface.users.get', params);
    return corbel.services.request({
        url: buildUri(this.uri),
        method: corbel.services.method.GET,
        query: params ? common.serializeParams(params) : null,
        withAuth: true
    });
};

/**
 * Builder for a specific user requests
 * @class
 * @memberOf iam
 * @param {String} id The id of the user
 */
var UserBuilder = iam.UserBuilder = function(id) {
    this.uri = 'user';
    this.id = id;
};

/**
 * Gets the user
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UserBuilder.prototype.get = function() {
    console.log('iamInterface.user.get');
    return getUser(corbel.services.method.GET, this.uri, this.id);
};

/**
 * Updates the user
 * @method
 * @memberOf iam.UserBuilder
 * @param  {Object} data    The data to update
 * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
 */
UserBuilder.prototype.update = function(data) {
    console.log('iamInterface.user.update', data);
    return corbel.services.request({
        url: buildUri(this.uri, this.id),
        method: corbel.services.method.PUT,
        data: data,
        withAuth: true
    });
};

/**
 * Update the logged user
 * @method
 * @memberOf iam.UsersBuilder
 * @param  {Object} data    The data to update
 * @param  {String} [token]   Token to use
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.updateMe = function(data, token) {
    console.log('iamInterface.users.updateMe', data);
    var args = {
        url: buildUri(this.uri, 'me'),
        method: corbel.services.method.PUT,
        data: data,
        args: args,
        withAuth: true
    };
    if (token) {
        args.accessToken = token;
    }
    return corbel.services.request(args);
};

/**
 * Deletes the user
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
 */
UserBuilder.prototype.delete = function() {
    console.log('iamInterface.user.delete');
    return corbel.services.request({
        url: buildUri(this.uri, this.id),
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Delete the logged user
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.deleteMe = function() {
    console.log('iamInterface.users.deleteMe');
    return corbel.services.request({
        url: buildUri(this.uri, 'me'),
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Sign Out the logged user
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.signOutMe = function() {
    // console.log('iamInterface.users.signOutMe');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/signout',
        method: corbel.services.method.PUT,
        withAuth: true
    });
};

/**
 * disconnect the user, all his tokens are deleted
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
 */
UserBuilder.prototype.disconnect = function() {
    // console.log('iamInterface.user.disconnect');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/disconnect',
        method: corbel.services.method.PUT,
        withAuth: true
    });
};

/**
 * disconnect the logged user, all his tokens are deleted
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.disconnectMe = function() {
    // console.log('iamInterface.users.disconnectMe');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/disconnect',
        method: corbel.services.method.PUT,
        withAuth: true
    });
};

/**
 * Adds an identity (link to an oauth server or social network) to the user
 * @method
 * @memberOf iam.UserBuilder
 * @param {Object} identity     The data of the identity
 * @param {String} oauthId      The oauth ID of the user
 * @param {String} oauthService The oauth service to connect (facebook, twitter, google, corbel)
 * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
 */
UserBuilder.prototype.addIdentity = function(identity) {
    // console.log('iamInterface.user.addIdentity', identity);
    corbel.validate.isValue(identity, 'Missing identity');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/identity',
        method: corbel.services.method.POST,
        data: identity,
        withAuth: true
    });
};

/**
 * Get user identities (links to oauth servers or social networks)
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise}  Q promise that resolves to {Array} of Identity or rejects with a {@link corbelError}
 */
UserBuilder.prototype.getIdentities = function() {
    console.log('iamInterface.user.getIdentities');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/identity',
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * User device register
 * @method
 * @memberOf iam.UsersBuilder
 * @param  {Object} data      The device data
 * @param  {Object} data.URI  The device token
 * @param  {Object} data.name The device name
 * @param  {Object} data.type The device type (Android, Apple)
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.registerMyDevice = function(data) {
    console.log('iamInterface.user.registerMyDevice');
    return corbel.services.requestXHR({
        url: buildUri(this.uri, 'me') + '/devices',
        method: corbel.services.method.PUT,
        withAuth: true,
        data: data
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * User device register
 * @method
 * @memberOf iam.UserBuilder
 * @param  {Object} data      The device data
 * @param  {Object} data.URI  The device token
 * @param  {Object} data.name The device name
 * @param  {Object} data.type The device type (Android, Apple)
 * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
 */
UserBuilder.prototype.registerDevice = function(data) {
    console.log('iamInterface.user.registerDevice');
    return corbel.services.requestXHR({
        url: buildUri(this.uri, this.id) + '/devices',
        method: corbel.services.method.PUT,
        withAuth: true,
        data: data
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Get device
 * @method
 * @memberOf iam.UserBuilder
 * @param  {String}  deviceId    The device id
 * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
 */
UserBuilder.prototype.getDevice = function(deviceId) {
    console.log('iamInterface.user.getDevice');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/devices/' + deviceId,
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Get devices
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
 */
UserBuilder.prototype.getDevices = function() {
    console.log('iamInterface.user.getDevices');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/devices/',
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Get my user devices
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.getMyDevices = function() {
    console.log('iamInterface.user.getMyDevices');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/devices',
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Get my user devices
 * @method
 * @memberOf iam.UsersBuilder
 * @param  {String}  deviceId    The device id
 * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.getMyDevice = function(deviceId) {
    console.log('iamInterface.user.getMyDevice');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/devices/' + deviceId,
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Delete user device
 * @method
 * @memberOf iam.UsersBuilder
 * @param  {String}  deviceId    The device id
 * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.deleteMyDevice = function(deviceId) {
    console.log.debug('iamInterface.user.deleteMyDevice');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/devices/' + deviceId,
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Delete user device
 * @method
 * @memberOf iam.UserBuilder
 * @param  {String}  deviceId    The device id
 * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
 */
UserBuilder.prototype.deleteDevice = function(deviceId) {
    console.log.debug('iamInterface.user.deleteDevice');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/devices/' + deviceId,
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Starts a username request
 * @return {iam.UsernameBuilder}    The builder to create the request
 */
iam.username = function() {
    console.log.debug('iamInterface.username');
    return new UsernameBuilder();
};

/**
 * Builder for creating requests of users name
 * @class
 * @memberOf iam
 */

var UsernameBuilder = iam.UsernameBuilder = function() {
    this.uri = 'username';
};

/**
 * Return availability endpoint.
 * @method
 * @memberOf iam.UsernameBuilder
 * @param  {String} username The username.
 * @return {Promise}     A promise which resolves into usename availability boolean state.
 */
UsernameBuilder.prototype.availability = function(username) {
    console.log('iamInterface.username.availability', username);
    return corbel.services.requestXHR({
        url: buildUri(this.uri, username),
        method: corbel.services.method.HEAD,
        withAuth: true
    }).then(
        function() {
            return false;
        },
        function(response) {
            if (response.httpStatus === 404) {
                return true;
            } else {
                return q.reject(response); //TODO - preguntar a anthanh
            }
        }
    );
};



/**
 * Gets the logged user profile
 * @method
 * @memberOf iam.UsersBuilder
 * @return {Promise} Q promise that resolves to a User Profile {Object} or rejects with a {@link corbelError}
 */
UsersBuilder.prototype.getMeProfile = function() {
    console.log('iamInterface.users.getMeProfile');
    return corbel.services.request({
        url: buildUri(this.uri, 'me') + '/profile',
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Get user profiles
 * @method
 * @memberOf iam.UserBuilder
 * @return {Promise}  Q promise that resolves to a User Profile or rejects with a {@link corbelError}
 */
UserBuilder.prototype.getProfile = function() {
    console.log('iamInterface.user.getProfile');
    return corbel.services.request({
        url: buildUri(this.uri, this.id) + '/profile',
        method: corbel.services.method.GET,
        withAuth: true
    });
};

UsersBuilder.prototype.getProfiles = function(params) {
    console.log('iamInterface.users.getProfiles', params);
    return corbel.services.request({
        url: buildUri(this.uri) + '/profile',
        method: corbel.services.method.GET,
        query: params ? common.serializeParams(params) : null, //TODO cambiar por util e implementar dicho metodo
        withAuth: true
    });
};

/**
 * Creates a DomainBuilder for domain managing requests.
 *
 * @param {String} domainId Domain id.
 *
 * @return {iam.DomainBuilder}
 */
iam.domain = function(domainId) {
    // console.log('iamInterface.domain');
    return new DomainBuilder(domainId);
};

/**
 * A builder for domain management requests.
 *
 * @param {String} domainId Domain id (optional).
 *
 * @class
 * @memberOf iam
 */
var DomainBuilder = iam.DomainBuilder = function(domainId) {
    this.domainId = domainId;
    this.uri = 'domain';
};

/**
 * Creates a new domain.
 *
 * @method
 * @memberOf iam.DomainBuilder
 *
 * @param {Object} domain                    The domain data.
 * @param {String} domain.description        Description of the domain.
 * @param {String} domain.authUrl            Authentication url.
 * @param {String} domain.allowedDomains     Allowed domains.
 * @param {String} domain.scopes             Scopes of the domain.
 * @param {String} domain.defaultScopes      Default copes of the domain.
 * @param {Object} domain.authConfigurations Authentication configuration.
 * @param {Object} domain.userProfileFields  User profile fields.
 *
 * @return {Promise} A promise with the id of the created domain or fails
 *                   with a {@link corbelError}.
 */
DomainBuilder.prototype.create = function(domain) {
    console.log('iamInterface.domain.create', domain);
    return corbel.services.requestXHR({
        url: buildUri(this.uri),
        method: corbel.services.method.POST,
        data: domain,
        withAuth: true
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Gets a domain.
 *
 * @method
 * @memberOf iam.DomainBuilder
 *
 * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
 */
DomainBuilder.prototype.get = function() {
    console.log('iamInterface.domain.get', this.domainId);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId),
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Updates a domain.
 *
 * @method
 * @memberOf iam.DomainBuilder
 *
 * @param {Object} domain                    The domain data.
 * @param {String} domain.description        Description of the domain.
 * @param {String} domain.authUrl            Authentication url.
 * @param {String} domain.allowedDomains     Allowed domains.
 * @param {String} domain.scopes             Scopes of the domain.
 * @param {String} domain.defaultScopes      Default copes of the domain.
 * @param {Object} domain.authConfigurations Authentication configuration.
 * @param {Object} domain.userProfileFields  User profile fields.
 *
 * @return {Promise} A promise or fails with a {@link corbelError}.
 */
DomainBuilder.prototype.update = function(domain) {
    console.log('iamInterface.domain.update', domain);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId),
        method: corbel.services.method.PUT,
        data: domain,
        withAuth: true
    });
};

/**
 * Removes a domain.
 *
 * @method
 * @memberOf iam.DomainBuilder
 *
 * @param {String} domainId The domain id.
 *
 * @return {Promise} A promise or fails with a {@link corbelError}.
 */
DomainBuilder.prototype.remove = function() {
    console.log('iamInterface.domain.remove', this.domainId);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId),
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Creates a ClientBuilder for client managing requests.
 *
 * @param {String} domainId Domain id (optional).
 * @param {String} clientId Client id (optional).
 *
 * @return {iam.ClientBuilder}
 */
iam.client = function(domainId, clientId) {
    console.log('iamInterface.client');
    return new ClientBuilder(domainId, clientId);
};

/**
 * A builder for client management requests.
 *
 * @param {String} domainId Domain id.
 * @param {String} clientId Client id.
 *
 * @class
 * @memberOf iam
 */
var ClientBuilder = iam.ClientBuilder = function(domainId, clientId) {
    this.domainId = domainId;
    this.clientId = clientId;
    this.uri = 'domain';
};

/**
 * Adds a new client.
 *
 * @method
 * @memberOf iam.ClientBuilder
 *
 * @param {Object} client                          The client data.
 * @param {String} client.id                       Client id.
 * @param {String} client.name                     Client domain (obligatory).
 * @param {String} client.key                      Client key (obligatory).
 * @param {String} client.version                  Client version.
 * @param {String} client.signatureAlghorithm      Signature alghorithm.
 * @param {Object} client.scopes                   Scopes of the client.
 * @param {String} client.clientSideAuthentication Option for client side authentication.
 * @param {String} client.resetUrl                 Reset password url.
 * @param {String} client.resetNotificationId      Reset password notification id.
 *
 * @return {Promise} A promise with the id of the created client or fails
 *                   with a {@link corbelError}.
 */
ClientBuilder.prototype.create = function(client) {
    console.log('iamInterface.domain.create', client);
    return corbel.services.requestXHR({
        url: buildUri(this.uri + '/' + this.domainId + '/client'),
        method: corbel.services.method.POST,
        data: client,
        withAuth: true
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Gets a client.
 *
 * @method
 * @memberOf iam.ClientBuilder
 *
 * @param {String} clientId Client id.
 *
 * @return {Promise} A promise with the client or fails with a {@link corbelError}.
 */
ClientBuilder.prototype.get = function() {
    console.log('iamInterface.domain.get', this.clientId);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Updates a client.
 *
 * @method
 * @memberOf iam.ClientBuilder
 *
 * @param {Object} client                          The client data.
 * @param {String} client.name                     Client domain (obligatory).
 * @param {String} client.key                      Client key (obligatory).
 * @param {String} client.version                  Client version.
 * @param {String} client.signatureAlghorithm      Signature alghorithm.
 * @param {Object} client.scopes                   Scopes of the client.
 * @param {String} client.clientSideAuthentication Option for client side authentication.
 * @param {String} client.resetUrl                 Reset password url.
 * @param {String} client.resetNotificationId      Reset password notification id.
 *
 * @return {Promise} A promise or fails with a {@link corbelError}.
 */
ClientBuilder.prototype.update = function(client) {
    console.log('iamInterface.domain.update', client);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
        method: corbel.services.method.PUT,
        data: client,
        withAuth: true
    });
};

/**
 * Removes a client.
 *
 * @method
 * @memberOf iam.ClientBuilder
 *
 * @param {String} clientId The client id.
 *
 * @return {Promise} A promise or fails with a {@link corbelError}.
 */
ClientBuilder.prototype.remove = function() {
    console.log('iamInterface.domain.remove', this.domainId, this.clientId);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

/**
 * Creates a ScopeBuilder for scope managing requests.
 *
 * @param {String} id Scope id.
 *
 * @return {iam.ScopeBuilder}
 */
iam.scope = function(id) {
    console.log('iamInterface.token');
    return new ScopeBuilder(id);
};

/**
 * A builder for scope management requests.
 *
 * @param {String} id Scope id.
 *
 * @class
 * @memberOf iam
 */
var ScopeBuilder = iam.ScopeBuilder = function(id) {
    this.id = id;
    this.uri = 'scope';
};

/**
 * Creates a new scope.
 *
 * @method
 * @memberOf iam.ScopeBuilder
 *
 * @param {Object} scope        The scope.
 * @param {Object} scope.rules  Scope rules.
 * @param {String} scope.type   Scope type.
 * @param {Object} scope.scopes Scopes for a composite scope.
 *
 * @return {Promise} A promise with the id of the created scope or fails
 *                   with a {@link corbelError}.
 */
ScopeBuilder.prototype.create = function(scope) {
    console.log('iamInterface.scope.create', scope);
    return corbel.services.requestXHR({
        url: buildUri(this.uri),
        method: corbel.services.method.POST,
        data: scope,
        withAuth: true
    }).then(function(res) {
        return corbel.services.extractLocationId(res);
    });
};

/**
 * Gets a scope.
 *
 * @method
 * @memberOf iam.ScopeBuilder
 *
 * @return {Promise} A promise with the scope or fails with a {@link corbelError}.
 */
ScopeBuilder.prototype.get = function() {
    console.log('iamInterface.scope.get', this.id);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.id),
        method: corbel.services.method.GET,
        withAuth: true
    });
};

/**
 * Removes a scope.
 *
 * @method
 * @memberOf iam.ScopeBuilder
 * @return {Promise} A promise user or fails with a {@link corbelError}.
 */
ScopeBuilder.prototype.remove = function() {
    console.log('iamInterface.scope.remove', this.id);
    return corbel.services.request({
        url: buildUri(this.uri + '/' + this.id),
        method: corbel.services.method.DELETE,
        withAuth: true
    });
};

var buildUri = function(uri, id) {
    if (id) {
        uri += '/' + id;
    }
    return corbel.common.get('iamEndpoint') + uri;
};

var doGetTokenRequest = function(uri, params, setCookie) {
    var args = {
        url: buildUri(uri),
        method: corbel.services.method.GET,
        query: $.param(_.extend({ //TODO hacernos nuestro utils.param
            assertion: getJwt(params),
            'grant_type': corbel.common.get('grantType')
        }, params.oauth))
    };

    if (setCookie) {
        args.headers = {
            RequestCookie: 'true'
        };
    }

    return corbel.services.request(args);
};

var doPostTokenRequest = function(uri, params, setCookie) {
    var args = {
        url: buildUri(uri),
        method: corbel.services.method.POST,
        data: {
            assertion: getJwt(params),
            'grant_type': corbel.common.get('grantType')
        },
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    };

    if (setCookie) {
        args.headers = {
            RequestCookie: 'true'
        };
    }
    return corbel.services.request(args);
};

var getJwt = function(params) {
    if (params.jwt) {
        return params.jwt;
    }
    if (params.claims) {
        return corbel.jwt.generate(params.claims);
    } else {
        throw new Error('Create token request must contains either jwt or claims parameter');
    }
};

var getUser = function(method, uri, id, postfix) {
    return corbel.services.request({
        url: (postfix ? buildUri(uri, id) + postfix : buildUri(uri, id)),
        method: corbel.services.method.GET,
        withAuth: true
    });
};