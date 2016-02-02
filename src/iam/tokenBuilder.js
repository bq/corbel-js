//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Creates a TokenBuilder for token requests
     * @return {corbel.Iam.TokenBuilder}
     */
    corbel.Iam.prototype.token = function() {
        var tokenBuilder = new TokenBuilder(this.driver);
        tokenBuilder.driver = this.driver;
        return tokenBuilder;
    };

    /**
     * A builder for token requests
     * @class
     * @memberOf Iam
     */
    var TokenBuilder = corbel.Iam.TokenBuilder = corbel.Services.inherit({

        constructor: function() {
            this.uri = 'oauth/token';
        },

        _buildUri: corbel.Iam._buildUri,

        /**
         * Build a JWT with default driver config
         * @param  {Object} params
         * @param  {String} [params.secret]
         * @param  {Object} [params.claims]
         * @param  {String} [params.claims.iss]
         * @param  {String} [params.claims.aud]
         * @param  {String} [params.claims.scope]
         * @return {String} JWT assertion
         */
        _getJwt: function(params) {
            params = params || {};
            params.claims = params.claims || {};

            if (params.jwt) {
                return params.jwt;
            }

            var secret = params.secret || this.driver.config.get('clientSecret');
            params.claims.iss = params.claims.iss || this.driver.config.get('clientId');
            params.claims.aud = params.claims.aud || this.driver.config.get('audience', corbel.Iam.AUD);
            params.claims.scope = params.claims.scope || this.driver.config.get('scopes', '');
            return corbel.jwt.generate(params.claims, secret);
        },

        _doGetTokenRequest: function(uri, params, setCookie) {
            var args = {
                url: this._buildUri(uri),
                method: corbel.request.method.GET,
                query: corbel.utils.param(corbel.utils.extend({
                    assertion: this._getJwt(params),
                    'grant_type': corbel.Iam.GRANT_TYPE
                }, params.oauth)), 
                withCredentials: true
            };

            if (setCookie) {
                args.headers = {
                    RequestCookie: 'true'
                };
            }
            
            return corbel.request.send(args);
        },

        _doPostTokenRequest: function(uri, params, setCookie) {
            var args = {
                url: this._buildUri(uri),
                method: corbel.request.method.POST,
                data: {
                    assertion: this._getJwt(params),
                    'grant_type': corbel.Iam.GRANT_TYPE
                },
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8', 
                withCredentials: true
            };

            if (setCookie) {
                args.headers = {
                    RequestCookie: 'true'
                };
            }
            return corbel.request.send(args);
        },

        /**
         * Creates a token to connect with iam
         * @method
         * @memberOf corbel.Iam.TokenBuilder
         * @param  {Object} params          Parameters to authorice
         * @param {String} [params.jwt]     Assertion to generate the token
         * @param {Object} [params.claims]  Claims to generate the token
         * @param {Object} [params.oauth]   Oauth specific params
         *
         * @param {string} params["oauth.service"]         Service that will provide the authorization, e.g. facebook  String  *
         * @param {string} params["oauth.code"]            Code used in OAuth2 for exanging for a token    String  only if OAuth2
         * @param {string} params["oauth.access_token"]    Access token used in OAuth2 for authentication. WARNING!! It is not recommended to pass an access token directly from the client, the oauth.code claim should be used instead.  String  
         * @param {string} params["oauth.redirect_uri"]    URI used by the client in OAuth2 to redirect the user when he does the login    String  only if OAuth2
         * @param {string} params["oauth.token"]           Token returned by OAuth1 server to the client when the user does the login  String  only if OAuth1
         * @param {string} params["oauth.verifier"]        Verifier returned by OAuth1 server to the client when the user does the login
         * 
         * @param {Boolean} [setCookie]     Sends 'RequestCookie' to server
         * @return {Promise}                Q promise that resolves to an AccessToken {Object} or rejects with a {@link corbelError}
         */
        create: function(params, setCookie) {
            params = params || {};
            // if there are oauth params this mean we should do use the GET verb
            var promise;
            try{
                if (params.oauth) {
                    promise = this._doGetTokenRequest(this.uri, params, setCookie);
                }
                
                // otherwise we use the traditional POST verb.
                promise = this._doPostTokenRequest(this.uri, params, setCookie);
                
            }catch(e){
                console.log('error', e);
                return Promise.reject(e);
            }

            var that = this;
            return promise.then(function(response) {
                that.driver.config.set(corbel.Iam.IAM_TOKEN, response.data);
                that.driver.config.set(corbel.Iam.IAM_DOMAIN, corbel.jwt.decode(response.data.accessToken).domainId);
                if (params.jwt) {
                    that.driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, corbel.jwt.decode(params.jwt).scope);
                }
                if (params.claims) {
                    if (params.claims.scope) {
                        that.driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, params.claims.scope);
                    } else {
                        that.driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, that.driver.config.get('scopes', ''));
                    }
                }
                return response;
            });
        },

        /**
         * Refresh a token to connect with iam
         * @method
         * @memberOf corbel.Iam.TokenBuilder
         * @param {String} [refresh_token]   Token to refresh an AccessToken
         * @param {String} [scopes]          Scopes to the AccessToken
         * @return {Promise}                 Q promise that resolves to an AccesToken {Object} or rejects with a {@link corbelError}
         */
        refresh: function(refreshToken, scopes) {
            // console.log('iamInterface.token.refresh', refreshToken);
            // we need refresh token to refresh access token
            corbel.validate.isValue(refreshToken, 'Refresh access token request must contains refresh token');
            // we need create default claims to refresh access token
            var params = {
                claims: {
                    'scope': scopes,
                    'refresh_token': refreshToken
                }
            };
            var that = this;
            var promise;
            try {
                promise = this._doPostTokenRequest(this.uri, params);
            } catch(e) {
                console.log('error', e);
                return Promise.reject(e);
            }
            // we use the traditional POST verb to refresh access token.
            return promise.then(function(response) {
                that.driver.config.set(corbel.Iam.IAM_TOKEN, response.data);
                return response;
            });
        }

    });

})();