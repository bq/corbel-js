//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * Builder for creating requests of users name
     * @class
     * @memberOf iam
     */

    var UsernameBuilder = corbel.Iam.UsernameBuilder = function() {
        this.uri = 'username';
    };

    UsernameBuilder.prototype._buildUri = corbel.Iam._buildUri;

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
     * Return availability endpoint.
     * @method
     * @memberOf corbel.Iam.UsernameBuilder
     * @param  {String} username The username.
     * @return {Promise}     A promise which resolves into usename availability boolean state.
     */
    UsernameBuilder.prototype.availability = function(username) {
        console.log('iamInterface.username.availability', username);
        return corbel.requestXHR.send({
            url: this._buildUri(this.uri, username),
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
                    return Promise.reject(response);
                }
            }
        );
    };

})();
