//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * getUser mixin for UserBuilder & UsersBuilder
     * @param  {String=GET|POST|PUT} method
     * @param  {String} uri
     * @param  {String} id
     * @param  {Bolean} postfix
     * @return {Promise}
     */
    corbel.Iam._getUser = function(method, uri, id, postfix) {
        return corbel.request.send({
            url: (postfix ? this._buildUri(uri, id) + postfix : this._buildUri(uri, id)),
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Builder for a specific user requests
     * @class
     * @memberOf iam
     * @param {String} id The id of the user
     */
    var UserBuilder = corbel.Iam.UserBuilder = function(id) {
        this.uri = 'user';
        this.id = id;
    };

    UserBuilder.prototype._buildUri = corbel.Iam._buildUri;
    UserBuilder.prototype._getUser = corbel.Iam._getUser;

    /**
     * Starts a user request
     * @param  {String} [id] Id of the user to perform the request
     * @return {corbel.Iam.UserBuilder | corbel.Iam.UsersBuilder}    The builder to create the request
     */
    corbel.Iam.prototype.user = function(id) {
        var builder;
        if (id) {
            builder = new UserBuilder(id);
        } else {
            builder = new UsersBuilder();
        }

        builder.driver = this.driver;
        return builder;
    };

    /**
     * Builder for creating requests of users collection
     * @class
     * @memberOf iam
     */

    var UsersBuilder = corbel.Iam.UsersBuilder = function() {
        this.uri = 'user';
    };


    UsersBuilder.prototype._buildUri = corbel.Iam._buildUri;
    UsersBuilder.prototype._getUser = corbel.Iam._getUser;

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
        return corbel.requestXHR.send({
            url: this._buildUri(this.uri + '/resetPassword'),
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
     * @memberOf corbel.Iam.UsersBuilder
     * @param  {Object} data The user data.
     * @return {Promise}     A promise which resolves into the ID of the created user or fails with a {@link corbelError}.
     */
    UsersBuilder.prototype.create = function(data) {
        console.log('iamInterface.users.create', data);
        return corbel.requestXHR.send({
            url: this._buildUri(this.uri),
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
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMe = function() {
        console.log('iamInterface.users.getMe');
        return this._getUser(corbel.services.method.GET, this.uri, 'me');
    };

    /**
     * Gets all users of the current domain
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to an {Array} of Users or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.get = function(params) {
        console.log('iamInterface.users.get', params);
        return corbel.request.send({
            url: this._buildUri(this.uri),
            method: corbel.services.method.GET,
            query: params ? corbel.utils.serializeParams(params) : null,
            withAuth: true
        });
    };

    /**
     * Gets the user
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.get = function() {
        console.log('iamInterface.user.get');
        return this._getUser(corbel.services.method.GET, this.uri, this.id);
    };

    /**
     * Updates the user
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @param  {Object} data    The data to update
     * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.update = function(data) {
        console.log('iamInterface.user.update', data);
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id),
            method: corbel.services.method.PUT,
            data: data,
            withAuth: true
        });
    };

    /**
     * Update the logged user
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @param  {Object} data    The data to update
     * @param  {String} [token]   Token to use
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.updateMe = function(data, token) {
        console.log('iamInterface.users.updateMe', data);
        var args = {
            url: this._buildUri(this.uri, 'me'),
            method: corbel.services.method.PUT,
            data: data,
            args: args,
            withAuth: true
        };
        if (token) {
            args.accessToken = token;
        }
        return corbel.request.send(args);
    };

    /**
     * Deletes the user
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.delete = function() {
        console.log('iamInterface.user.delete');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };

    /**
     * Delete the logged user
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.deleteMe = function() {
        console.log('iamInterface.users.deleteMe');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me'),
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };

    /**
     * Sign Out the logged user
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.signOutMe = function() {
        // console.log('iamInterface.users.signOutMe');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/signout',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };

    /**
     * disconnect the user, all his tokens are deleted
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.disconnect = function() {
        // console.log('iamInterface.user.disconnect');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/disconnect',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };

    /**
     * disconnect the logged user, all his tokens are deleted
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.disconnectMe = function() {
        // console.log('iamInterface.users.disconnectMe');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/disconnect',
            method: corbel.services.method.PUT,
            withAuth: true
        });
    };

    /**
     * Adds an identity (link to an oauth server or social network) to the user
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @param {Object} identity     The data of the identity
     * @param {String} oauthId      The oauth ID of the user
     * @param {String} oauthService The oauth service to connect (facebook, twitter, google, corbel)
     * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.addIdentity = function(identity) {
        // console.log('iamInterface.user.addIdentity', identity);
        corbel.validate.isValue(identity, 'Missing identity');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/identity',
            method: corbel.services.method.POST,
            data: identity,
            withAuth: true
        });
    };

    /**
     * Get user identities (links to oauth servers or social networks)
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise}  Q promise that resolves to {Array} of Identity or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getIdentities = function() {
        console.log('iamInterface.user.getIdentities');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/identity',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * User device register
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @param  {Object} data      The device data
     * @param  {Object} data.URI  The device token
     * @param  {Object} data.name The device name
     * @param  {Object} data.type The device type (Android, Apple)
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.registerMyDevice = function(data) {
        console.log('iamInterface.user.registerMyDevice');
        return corbel.requestXHR.send({
            url: this._buildUri(this.uri, 'me') + '/devices',
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
     * @memberOf corbel.Iam.UserBuilder
     * @param  {Object} data      The device data
     * @param  {Object} data.URI  The device token
     * @param  {Object} data.name The device name
     * @param  {Object} data.type The device type (Android, Apple)
     * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.registerDevice = function(data) {
        console.log('iamInterface.user.registerDevice');
        return corbel.requestXHR.send({
            url: this._buildUri(this.uri, this.id) + '/devices',
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
     * @memberOf corbel.Iam.UserBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getDevice = function(deviceId) {
        console.log('iamInterface.user.getDevice');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Get devices
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getDevices = function() {
        console.log('iamInterface.user.getDevices');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/devices/',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Get my user devices
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMyDevices = function() {
        console.log('iamInterface.user.getMyDevices');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/devices',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Get my user devices
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMyDevice = function(deviceId) {
        console.log('iamInterface.user.getMyDevice');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/devices/' + deviceId,
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Delete user device
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.deleteMyDevice = function(deviceId) {
        console.log.debug('iamInterface.user.deleteMyDevice');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/devices/' + deviceId,
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };

    /**
     * Delete user device
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @param  {String}  deviceId    The device id
     * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.deleteDevice = function(deviceId) {
        console.log.debug('iamInterface.user.deleteDevice');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
            method: corbel.services.method.DELETE,
            withAuth: true
        });
    };

    /**
     * Gets the logged user profile
     * @method
     * @memberOf corbel.Iam.UsersBuilder
     * @return {Promise} Q promise that resolves to a User Profile {Object} or rejects with a {@link corbelError}
     */
    UsersBuilder.prototype.getMeProfile = function() {
        console.log('iamInterface.users.getMeProfile');
        return corbel.request.send({
            url: this._buildUri(this.uri, 'me') + '/profile',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    /**
     * Get user profiles
     * @method
     * @memberOf corbel.Iam.UserBuilder
     * @return {Promise}  Q promise that resolves to a User Profile or rejects with a {@link corbelError}
     */
    UserBuilder.prototype.getProfile = function() {
        console.log('iamInterface.user.getProfile');
        return corbel.request.send({
            url: this._buildUri(this.uri, this.id) + '/profile',
            method: corbel.services.method.GET,
            withAuth: true
        });
    };

    UsersBuilder.prototype.getProfiles = function(params) {
        console.log('iamInterface.users.getProfiles', params);
        return corbel.request.send({
            url: this._buildUri(this.uri) + '/profile',
            method: corbel.services.method.GET,
            query: params ? corbel.utils.serializeParams(params) : null, //TODO cambiar por util e implementar dicho metodo
            withAuth: true
        });
    };

})();
