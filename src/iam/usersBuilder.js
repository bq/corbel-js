//@exclude
// jshint unused: false
'use strict';
//@endexclude

(function() {

    /**
     * Starts a user request
     * @param  {string} [id=id|'me'] Id of the user to perform the request
     * @return {corbel.Iam.UserBuilder|corbel.Iam.UserMeBuilder}    The builder to create the request
     */
     corbel.Iam.prototype.user = function(id) {
         var builder;
         if (id === 'me') {
           builder = new UserBuilder('me');
         }
         else if (id) {
             builder = new UserBuilder(id);
         } else {
             builder = new UserMeBuilder('me');
         }

         builder.driver = this.driver;
         return builder;
     };

     /**
      * Starts a users request
      * @return {corbel.Iam.UserBuilder|corbel.Iam.UsersBuilder}    The builder to create the request
      */
     corbel.Iam.prototype.users = function() {
         var builder =  new UsersBuilder();

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
    var CommonUserBuilder = corbel.Iam.CommonUserBuilder = corbel.Services.inherit({

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
        _update: function(data) {
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
        _delete: function() {
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
        _signOut: function() {
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
        _disconnect: function() {
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
        _getIdentities: function() {
            console.log('iamInterface.user.getIdentities');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/identity',
                method: corbel.request.method.GET
            });
        },
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
         _registerDevice: function(data) {
             console.log('iamInterface.user.registerDevice');
             return this.request({
                 url: this._buildUri(this.uri, this.id) + '/devices',
                 method: corbel.request.method.PUT,
                 data: data
             }).then(function(res) {
                 return corbel.Services.getLocationId(res);
             });
         },

         /**
          * Get device
          * @method
          * @memberOf corbel.Iam.UserBuilder
          * @param  {string}  deviceId    The device id
          * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
          */
         _getDevice: function(deviceId) {
             console.log('iamInterface.user.getDevice');
             return this.request({
                 url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                 method: corbel.request.method.GET
             });
         },

         /**
          * Get all user devices
          * @method
          * @memberOf corbel.Iam.UserBuilder
          * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
          */
         _getDevices: function() {
             console.log('iamInterface.user.getDevices');
             return this.request({
                 url: this._buildUri(this.uri, this.id) + '/devices/',
                 method: corbel.request.method.GET
             });
         },

         /**
          * Delete user device
          * @method
          * @memberOf corbel.Iam.UserBuilder
          * @param  {string}  deviceId    The device id
          * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
          */
         _deleteDevice: function(deviceId) {
             console.log('iamInterface.user.deleteDevice');
             return this.request({
                 url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                 method: corbel.request.method.DELETE
             });
         },
         /**
          * Get user profiles
          * @method
          * @memberOf corbel.Iam.UserBuilder
          * @return {Promise}  Q promise that resolves to a User Profile or rejects with a {@link corbelError}
          */
        _getProfile: function() {
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
        _deleteGroup: function(group) {
            console.log('iamInterface.user.deleteGroup');
            return this.request({
                url: this._buildUri(this.uri, this.id) + '/groups/'+group,
                method: corbel.request.method.DELETE
            });
        }

    });

    var UserBuilder = corbel.Iam.CommonUserBuilder.inherit({
        deleteGroup : function(){
            return this._deleteGroup.apply(this, arguments);
        },
        update : function(){
            return this._update.apply(this, arguments);
        },
        delete :function(){
             return this._delete.apply(this, arguments);
        },
        registerDevice :function(){
             return this._registerDevice.apply(this, arguments);
        },
        getDevices :function(){
             return this._getDevices.apply(this, arguments);
        },
        getDevice :function(){
             return this._getDevice.apply(this, arguments);
        },
        deleteDevice :function(){
             return this._deleteDevice.apply(this, arguments);
        },
        signOut :function(){
             return this._signOut.apply(this, arguments);
        },
        disconnect :function(){
             return this._disconnect.apply(this, arguments);
        },
        getIdentities :function(){
             return this._getIdentities.apply(this, arguments);
        },
        getProfile : function(){
             return this._getProfile.apply(this, arguments);
        }
    });

    var UserMeBuilder = corbel.Iam.CommonUserBuilder.inherit({
        deleteMyGroup : function(){
            return this._deleteGroup.apply(this, arguments);
        },
        updateMe : function(){
            return this._update.apply(this, arguments);
        },
        deleteMe :function(){
             return this._delete.apply(this, arguments);
        },
        registerMyDevice :function(){
             return this._registerDevice.apply(this, arguments);
        },
        getMyDevices :function(){
             return this._getDevices.apply(this, arguments);
        },
        getMyDevice :function(){
             return this._getDevice.apply(this, arguments);
        },
        deleteMyDevice :function(){
             return this._deleteDevice.apply(this, arguments);
        },
        signOutMe :function(){
             return this._signOut.apply(this, arguments);
        },
        disconnectMe :function(){
             return this._disconnect.apply(this, arguments);
        },
        getMyIdentities :function(){
             return this._getIdentities.apply(this, arguments);
        },
        getMyProfile : function(){
             return this._getProfile.apply(this, arguments);
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
                return corbel.Services.getLocationId(res);
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
        }
    });
})();
