//@exclude
'use strict';
//@endexclude

(function() {
    /**
     * Create a TokenBuilder for token managing requests.
     * Starts to build a token request
     * @method
     * @param  {Object} clientParams
     * @param  {String} [clientParams.clientId=corbel.Config.get('oauthClientId')]    Client id
     * @param  {String} [clientParams.clientSecret=corbel.Config.get('oauthSecret')]  Client secret
     * @param  {String} clientParams.grantType                                        The grant type (only allowed 'authorization_code')
     * @return {corbel.Oauth.TokenBuilder}
     */
    corbel.Oauth.prototype.token = function(clientParams) {
        console.log('oauthInterface.token');

        corbel.Oauth._checkProp(clientParams, ['grantType'], 'Invalid client parameters');
        corbel.Oauth._validateGrantType(clientParams.grantType);
        clientParams.clientId = clientParams.clientId || corbel.Config.get('oauthClientId');
        clientParams.clientSecret = clientParams.clientSecret || corbel.Config.get('oauthSecret');
        var params = {
            contentType: corbel.Oauth._URL_ENCODED,
            data: corbel.Oauth._trasformParams(clientParams)
        };
        var token = new TokenBuilder(params);
        token.driver = this.driver;
        return token;
    };
    /**
     * A builder for a token management requests.
     * @class
     *
     * @param {Object} params Initial params
     * 
     * @memberOf corbel.Oauth.TokenBuilder
     */
    var TokenBuilder = corbel.Oauth.TokenBuilder = corbel.Services.inherit({

        constructor: function(params) {
            this.params = params;
            this.uri = 'oauth/token';
        },
        /**
         * Get an access token
         * @method
         * @memberOf corbel.Oauth.TokenBuilder
         * 
         * @param  {String} code The code to exchange for the token
         * 
         * @return {Promise}     promise that resolves to an access token  {Object}  or rejects with a {@link CorbelError}
         */
        get: function(code) {
            console.log('oauthInterface.token.get');
            this.params.data.code = code;
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: this.params
            });
        },

        _buildUri: corbel.Oauth._buildUri
    });
})();
