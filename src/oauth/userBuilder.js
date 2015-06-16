//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {
    /**
     * Create a UserBuilder for user managing requests.
     * Starts a user request
     * @method
     * @param  {Object} clientParams
     * @param  {String} [clientParams.clientId=corbel.Config.get('oauthClientId')]    Client id
     * @param  {String} [clientParams.clientSecret=corbel.Config.get('oauthSecret')]  Client secret
     * @param  {String} clientParams.grantType                                        The grant type (only allowed 'authorization_code')
     * @return {corbel.Oauth.UserBuilder}
     */
    corbel.Oauth.prototype.user = function(clientParams, accessToken) {
        console.log('oauthInterface.user');

        var params = {};

        if (accessToken) {
            params.accessToken = accessToken;
            params.headers = {};
            params.headers.Accept = 'application/json';
        }

        clientParams = clientParams || {};
        var clientId = clientParams.clientId || corbel.Config.get('oauthClientId');
        var clientSecret = clientParams.clientSecret || corbel.Config.get('oauthSecret');

        var user = new UserBuilder(params, clientId, clientSecret);
        user.driver = this.driver;
        return user;
    };
    /**
     * A builder for a user management requests.
     * @class
     * 
     * @param {Object} params           Parameters for initializing the builder
     * @param {String} [clientId]       Application client Id (required for creating user)
     * @param {String} [clientSecret]   Application client secret (required for creating user)
     *    
     * @memberOf corbel.Oauth.UserBuilder
     */
    var UserBuilder = corbel.Oauth.UserBuilder = corbel.Services.BaseServices.inherit({

        constructor: function(params, clientId, clientSecret) {
            this.params = params;
            this.clientSecret = clientSecret;
            this.clientId = clientId;
            this.uri = 'oauth/user';
        },
        _buildUri: corbel.Oauth._buildUri,
        /**
         * Adds a new user to the oauth server.
         *
         * @method
         * @memberOf corbel.Oauth.UserBuilder
         *
         * @param {Object} user    The user to be created
         * @param {String} username The username of the user
         * @param {String} email    The email of the user
         * @param {String} password The password of the user
         *
         * @return {Promise} A promise with the id of the created user or fails
         *                   with a {@link corbelError}.
         */
        create: function(user) {
            console.log('oauthInterface.user.create', user);
            
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                headers: {
                    Authorization: 'Basic ' + this.getSerializer()(this.clientId + ':' + this.clientSecret)
                },
                dataType: 'text',
                data: user
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },
        /**
         * Gets the user or the logged user
         * @method
         * @memberOf corbel.Oauth.UserBuilder
         * 
         * @param  {Object} id      The user id/me 
         *  
         * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
         */
        get: function(id) {
            console.log('oauthInterface.user.get');
            this.uri += '/' + id;
            return this.request({
                url: this._buildUri(this.uri, this.uri),
                method: corbel.request.method.GET
            });
        },
        /**
         * Get profile of some user or the logged user
         * @method
         * @memberOf corbel.Oauth.UserBuilder
         * @param  {Object} id      The user id/me 
         * @return {Promise}        Q promise that resolves to the profile from User {Object} or rejects with a {@link corbelError}
         */
        getProfile: function(id) {
            console.log('oauthInterface.user.getProfile');
            this.uri += '/' + id + '/profile';
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.GET
            });
        },
        /**
         * Updates the user or  the logged user
         * @method
         * @memberOf corbel.Oauth.UserBuilder
         * 
         * @param  {Object} id              The user id or me
         * @param  {Object} modification    Json object with the modificacion of the user
         * 
         * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        update: function(id, modification) {
            console.log('oauthInterface.user.update', modification);
            this.uri += '/' + id;
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.PUT,
                data: modification
            });
        },
        /**
         * Deletes the user or the logged user
         * @memberOf corbel.Oauth.UserBuilder
         * 
         * @param  {Object} id        The user id or me
         * 
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
         */
        delete: function(id) {
            console.log('oauthInterface.user.delete');
            this.uri += '/' + id;
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.DELETE
            });
        },
        /**
         * Sends a reset password email to the email address recived.
         * @method
         * @memberOf corbel.Oauth.UsersBuilder
         * @param  {String} userEmailToReset The email to send the message
         * @return {Promise}                 Q promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        sendResetPasswordEmail: function(userEmailToReset) {
            console.log('oauthInterface.user.SendResetPasswordEmail', userEmailToReset);
            return this.request({
                url: this._buildUri(this.uri + '/resetPassword'),
                method: corbel.request.method.GET,
                query: 'email=' + userEmailToReset,
                headers: {
                    Authorization: 'Basic ' + this.getSerializer()(this.clientId + ':' + this.clientSecret)
                },
                noRetry: true
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },
        /**
         * Sends a email to the logged user or user to validate his email address
         * @method
         * @memberOf corbel.Oauth.UsersBuilder
         * 
         * @param  {Object} id     The user id or me
         * 
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        sendValidateEmail: function(id) {
            console.log('oauthInterface.user.sendValidateEmail');
            this.uri += '/' + id + '/validate';
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.GET,
                withAuth: true
            });
        },
        /**
         * Validates the email of a user or the logged user
         * @method
         * @memberOf corbel.Oauth.UsersBuilder
         * 
         * @param  {Object} id   The user id or me
         * 
         * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        emailConfirmation: function(id) {
            console.log('oauthInterface.user.emailConfirmation');
            this.uri += '/' + id + '/emailConfirmation';
            return this.request({
                url: this._buildUri(this.uri, id),
                method: corbel.request.method.PUT,
                noRetry: true
            });
        },

        getSerializer: function() {
            if (corbel.Config.isNode) {
                return require('btoa');
            } else {
                return btoa;
            }
        }
    });
})();
