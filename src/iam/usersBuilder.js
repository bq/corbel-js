//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Starts a user request
     * @param  {string} [id=undefined|id|'me'] Id of the user to perform the request
     * @return {corbel.Iam.UserBuilder|corbel.Iam.UsersBuilder}    The builder to create the request
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
     * getUser mixin for UserBuilder & UsersBuilder
     * @param  {string} uri
     * @param  {string} id
     * @param  {Bolean} postfix
     * @return {Promise}
     */
    corbel.Iam._getUser = function(method, uri, id, postfix) {
        var url = (postfix ? this._buildUri(uri, id) + postfix : this._buildUri(uri, id));
        return this.request({
            url: url,
            method: corbel.request.method.GET
        });
    };

    /**
     * Builder for a specific user requests
     * @class
     * @memberOf iam
     * @param {string} id The id of the user
     */
    var UserBuilder = corbel.Iam.UserBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.uri = 'user';
            this.id = id;
        },

        _buildUri: corbel.Iam._buildUri,
        _getUser: corbel.Iam._getUser,

        /**
         * Gets the user
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
         */
        get: function() {
            console.log('iamInterface.user.get');
            return this._getUser(corbel.request.method.GET, this.uri, this.id);
        },

        /**
         * Updates the user
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @param  {Object} data    The data to update
         * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        update: function(data) {
            console.log('iamInterface.user.update', data);
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.PUT,
                data: data
            });
        },

        /**
         * Deletes the user
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        delete: function() {
            console.log('iamInterface.user.delete');
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
        },

        /**
         * Sign Out the logged user.
         * @example
         * iam().user('me').signOut();
         * @method
         * @memberOf corbel.Iam.UsersBuilder
         * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
         */
        signOut: function() {
            console.log('iamInterface.users.signOutMe');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/signout',
                method: corbel.request.method.PUT
            });
        },

        /**
         * disconnect the user, all his tokens are deleted
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        disconnect: function() {
            console.log('iamInterface.user.disconnect');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/disconnect',
                method: corbel.request.method.PUT
            });
        },

        /**
         * Adds an identity (link to an oauth server or social network) to the user
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @param {Object} identity     The data of the identity
         * @param {string} oauthId      The oauth ID of the user
         * @param {string} oauthService The oauth service to connect (facebook, twitter, google, corbel)
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        addIdentity: function(identity) {
            // console.log('iamInterface.user.addIdentity', identity);
            corbel.validate.isValue(identity, 'Missing identity');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/identity',
                method: corbel.request.method.POST,
                data: identity
            });
        },

        /**
         * Get user identities (links to oauth servers or social networks)
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @return {Promise}  Q promise that resolves to {Array} of Identity or rejects with a {@link corbelError}
         */
        getIdentities: function() {
            console.log('iamInterface.user.getIdentities');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/identity',
                method: corbel.request.method.GET
            });
        },

        getProfile: function() {
            console.log('iamInterface.user.getProfile');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/profile',
                method: corbel.request.method.GET
            });
        },

        /**
         * Add groups to the user
         * @method
         * @memberOf iam.UserBuilder
         * @param {Object} groups     The data of the groups
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
         */
        addGroups: function(groups) {
            console.log('iamInterface.user.addGroups');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/groups',
                method: corbel.request.method.PUT,
                data: groups
            });
        },

        /**
         * Delete group to user
         * @method
         * @memberOf iam.UserBuilder
         * @param {Object} groups     The data of the groups
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
         */
        deleteGroup: function(group) {
            console.log('iamInterface.user.deleteGroup');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/groups/'+group,
                method: corbel.request.method.DELETE
            });
        }


    });


    /**
     * Builder for creating requests of users collection
     * @class
     * @memberOf iam
     */
    var UsersBuilder = corbel.Iam.UsersBuilder = corbel.Services.inherit({

        constructor: function() {
            this.uri = 'user';
        },

        _buildUri: corbel.Iam._buildUri,

        /**
         * Sends a reset password email to the email address recived.
         * @method
         * @memberOf oauth.UsersBuilder
         * @param  {string} userEmailToReset The email to send the message
         * @return {Promise}                 Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        sendResetPasswordEmail: function(userEmailToReset) {
            console.log('iamInterface.users.sendResetPasswordEmail', userEmailToReset);
            var query = 'email=' + userEmailToReset;
            return this.request({
                url: this._buildUri(this.uri + '/resetPassword'),
                method: corbel.request.method.GET,
                query: query
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },

        /**
         * Creates a new user.
         * @method
         * @memberOf corbel.Iam.UsersBuilder
         * @param  {Object} data The user data.
         * @return {Promise}     A promise which resolves into the ID of the created user or fails with a {@link corbelError}.
         */
        create: function(data) {
            console.log('iamInterface.users.create', data);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: data
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },

        /**
         * Gets all users of the current domain
         * @method
         * @memberOf corbel.Iam.UsersBuilder
         * @return {Promise} Q promise that resolves to an {Array} of Users or rejects with a {@link corbelError}
         */
        get: function(params) {
            console.log('iamInterface.users.get', params);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },

        getProfiles: function(params) {
            console.log('iamInterface.users.getProfiles', params);
            return this.request({
                url: this._buildUri(this.uri) + '/profile',
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null //TODO cambiar por util e implementar dicho metodo
            });
        },

        /**
         * Update the logged user
         * @method
         * @memberOf iam.UsersBuilder
         * @param  {Object} data    The data to update
         * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
         */
        updateMe: function(data) {
            console.log('iamInterface.users.updateMe', data);
            return this.request({
                url: this._buildUri(this.uri, 'me'),
                method: corbel.request.method.PUT,
                data: data,
                withAuth: true
            });
        },

        /**
         * Delete the logged user
         * @method
         * @memberOf corbel.Iam.UserBuilder
         * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
         */
        deleteMe: function() {
            console.log('iamInterface.user.deleteMe');
            return this.request({
                url: this._buildUri(this.uri, 'me'),
                method: corbel.request.method.DELETE,
                withAuth: true
            });
        },

        /**
         * User device register
         * @method
         * @memberOf corbel.iam.UserBuilder
         * @param  {Object} data      The device data
         * @param  {Object} data.URI  The device token
         * @param  {Object} data.name The device name
         * @param  {Object} data.type The device type (Android, Apple)
         * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link SilkRoadError}
         */
        registerMyDevice : function(data) {
            console.log('iamInterface.user.registerMyDevice');
            return this.request({
                url: this._buildUri(this.uri, 'me') + '/devices',
                method: corbel.request.method.PUT,
                withAuth: true,
                data: data
            }).then(function(res) {
                return this.extractLocationId(res);
            });
        },

        /**
         * User device register
         * @method
         * @memberOf iam.UserBuilder
         * @param  {Object} data      The device data
         * @param  {Object} data.URI  The device token
         * @param  {Object} data.name The device name
         * @param  {Object} data.type The device type (Android, Apple)
         * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link SilkRoadError}
         */
        registerDevice: function(data) {
            console.log('iamInterface.user.registerDevice');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/devices',
                method: corbel.request.method.PUT,
                withAuth: true,
                data: data
            }).then(function(res) {
                return this.extractLocationId(res);
            });
        },

        /**
         * Get device
         * @method
         * @memberOf iam.UserBuilder
         * @param  {String}  deviceId    The device id
         * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link SilkRoadError}
         */
        getDevice: function(deviceId) {
            console.log('iamInterface.user.getDevice');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                method: corbel.request.method.GET,
                withAuth: true
            });
        },

        /**
         * Get devices
         * @method
         * @memberOf iam.UserBuilder
         * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link SilkRoadError}
         */
        getDevices: function() {
            console.log('iamInterface.user.getDevices');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/devices/',
                method: corbel.request.method.GET,
                withAuth: true
            });
        },

        /**
         * Get my user devices
         * @method
         * @memberOf iam.UsersBuilder
         * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link SilkRoadError}
         */
        getMyDevices: function() {
            console.log('iamInterface.user.getMyDevices');
            return this.request({
                url: this._buildUri(this.uri, 'me') + '/devices',
                method: corbel.request.method.GET,
                withAuth: true
            });
        },

        /**
         * Get my user devices
         * @method
         * @memberOf iam.UsersBuilder
         * @param  {String}  deviceId    The device id
         * @return {Promise} Q promise that resolves to a list of Device {Object} or rejects with a {@link SilkRoadError}
         */
        getMyDevice: function(deviceId) {
            console.log('iamInterface.user.getMyDevice');
            return this.request({
                url: this._buildUri(this.uri, 'me') + '/devices/' + deviceId,
                method: corbel.request.method.GET,
                withAuth: true
            });
        },

        /**
         * Delete user device
         * @method
         * @memberOf iam.UsersBuilder
         * @param  {String}  deviceId    The device id
         * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link SilkRoadError}
         */
        deleteMyDevice: function(deviceId) {
            console.log('iamInterface.user.deleteMyDevice');
            return this.request({
                url: this._buildUri(this.uri, 'me') + '/devices/' + deviceId,
                method: corbel.request.method.DELETE,
                withAuth: true
            });
        },

        /**
         * Delete user device
         * @method
         * @memberOf iam.UserBuilder
         * @param  {String}  deviceId    The device id
         * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link SilkRoadError}
         */
        deleteDevice: function(deviceId) {
            console.log('iamInterface.user.deleteDevice');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                method: corbel.request.method.DELETE,
                withAuth: true
            });
        }

    });

})();
