//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Starts a username request
     * @return {corbel.Iam.UsernameBuilder}    The builder to create the request
     */
    corbel.Iam.prototype.username = function() {
        var username = new UsernameBuilder();
        username.driver = this.driver;
        return username;
    };

    /**
     * Builder for creating requests of users name
     * @class
     * @memberOf iam
     */
    var UsernameBuilder = corbel.Iam.UsernameBuilder = corbel.Services.inherit({

        constructor: function() {
            this.uri = 'username';
        },

        _buildUri: corbel.Iam._buildUri,

        /**
         * Return availability endpoint.
         * @method
         * @memberOf corbel.Iam.UsernameBuilder
         * @param  {String} username The username.
         * @return {Promise}     A promise which resolves into usename availability boolean state.
         */
        availability: function(username) {
            console.log('iamInterface.username.availability', username);
            return this.request({
                url: this._buildUri(this.uri, username),
                method: corbel.request.method.HEAD
            }).then(function() {
                return false;
            }).catch(function(response) {
                if (response.status === 404) {
                    return true;
                } else {
                    return Promise.reject(response);
                }
            });
        },

        /**
        * Gets a UserId.
        *
        * @method
        * @memberOf corbel.Iam.UsernameBuilder
        *
        * @param {String} username The username.
        *
        * @return {Promise} A promise with the user or fails with a {@link corbelError}.
        */
        getUserId: function(username) {
            console.log('iamInterface.username.getUserId', username);
            return this.request({
                url: this._buildUri(this.uri, username),
                method: corbel.request.method.GET
            })
            .then(function(id){
                return id;
            });
        }
    });

})();
