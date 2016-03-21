//@exclude
'use strict';
//@endexclude

(function() {

    /**
    * Creates a EmailBuilder for email requests
    * @return {corbel.Iam.EmailBuilder}
    */
    corbel.Iam.prototype.email = function() {
        var builder;
        builder = new EmailBuilder();
        builder.driver = this.driver;
        return builder;
    };

    /**
    * Builder for creating requests of email
    * @class
    * @memberOf iam
    */
    var EmailBuilder = corbel.Iam.EmailBuilder = corbel.Services.inherit({

        constructor: function() {
            this.uri = 'email';
        },

        /**
        * Gets a UserId.
        *
        * @method
        * @memberOf corbel.Iam.EmailBuilder
        *
        * @param {String} email The email.
        *
        * @return {Promise} A promise with the user or fails with a {@link corbelError}.
        */
        getUserId: function(email) {
            console.log('iamInterface.email.getUserId', email);
            corbel.validate.value('email', email);

            return this.request({
                url: this._buildUriWithDomain(this.uri, email),
                method: corbel.request.method.GET
            });
        },

        /**
        * Return availability endpoint.
        * @method
        * @memberOf corbel.Iam.EmailBuilder
        * @param  {String} email The email.
        * @return {Promise}     A promise which resolves into email availability boolean state.
        */
        availability: function(email) {
            console.log('iamInterface.email.availability', email);
            corbel.validate.value('email', email);
            
            return this.request({
                url: this._buildUriWithDomain(this.uri, email),
                method: corbel.request.method.HEAD
            }).then(
                function() {
                    return false;
                },
                function(response) {
                    if (response.status === 404) {
                        return true;
                    } else {
                        return Promise.reject(response);
                    }
                }
            );
        },
        
        _buildUriWithDomain: corbel.Iam._buildUriWithDomain
        
    });
})();
