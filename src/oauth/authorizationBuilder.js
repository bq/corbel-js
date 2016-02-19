//@exclude
'use strict';
//@endexclude

(function () {
  /**
   * Create a AuthorizationBuilder for resource managing requests.
   *
   * @param {Object} clientParams  Initial params
   *
   * @return {corbel.Oauth.AuthorizationBuilder}
   */
  corbel.Oauth.prototype.authorization = function (clientParams) {
    console.log('oauthInterface.authorization', clientParams);

    corbel.Oauth._checkProp(clientParams, ['responseType'], 'Invalid client parameters');
    clientParams.responseType = clientParams.responseType.toLowerCase();
    corbel.Oauth._validateResponseType(clientParams.responseType);
    if (clientParams.responseType.toLowerCase() === 'code') {
      corbel.Oauth._checkProp(clientParams, ['redirectUri'], 'Invalid client parameters');
    }
    clientParams.clientId = clientParams.clientId || corbel.Config.get('oauthClientId');
    var params = {
      contentType: corbel.Oauth._URL_ENCODED,
      data: corbel.Oauth._trasformParams(clientParams),
      // http://stackoverflow.com/questions/1557602/jquery-and-ajax-response-header
      noRedirect: true
    };
    var authorization = new AuthorizationBuilder(params);
    authorization.driver = this.driver;
    return authorization;
  };

  /**
   * A builder for authorization management requests.
   *
   * @param {Object} params  Initial params
   *
   * @class
   * @memberOf corbel.Oauth.AuthorizationBuilder
   */
  var AuthorizationBuilder = corbel.Oauth.AuthorizationBuilder = corbel.Services.inherit({

    constructor: function (params) {
      this.params = params;
      this.uri = 'oauth';
    },

    /**
     * Does a login with stored cookie in oauth server
     * @method
     * @memberOf corbel.Oauth.AuthorizationBuilder
     * @return {Promise} Q promise that resolves to a redirection to redirectUri or rejects with a 404 {@link CorbelError}
     */
    loginWithCookie: function () {
      console.log('oauthInterface.authorization.dialog');
      var that = this;

      return this.request({
          url: this._buildUri(this.uri + '/authorize'),
          method: corbel.request.method.GET,
          dataType: 'text',
          withCredentials: true,
          query: corbel.utils.toURLEncoded(this.params.data),
          noRedirect: true,
          contentType: corbel.Oauth._URL_ENCODED
        })
        .then(function (res) {
          var params = {
            url: corbel.Services.getLocation(res),
            withCredentials: true
          };
          return that.request(params);
        });
    },
    /**
     * Does a login in oauth server
     * @method
     * @memberOf corbel.Oauth.AuthorizationBuilder
     * @param  {String} username The username of the user to log in
     * @param  {String} password The password of the user
     * @param  {Boolean} setCookie Sends 'RequestCookie' to the server
     * @param  {Boolean} redirect The user when he does the login
     * @return {Promise}         Q promise that resolves to a redirection to redirectUri or rejects with a {@link CorbelError}
     */
    login: function (username, password, setCookie, redirect) {
      console.log('oauthInterface.authorization.login', username + ':' + password);

      if (username) {
        this.params.data.username = username;
      }

      if (password) {
        this.params.data.password = password;
      }

      this.params.withCredentials = true;
      var that = this;

      // make request, generate oauth cookie, then redirect manually
      return this.request({
          url: this._buildUri(this.uri + '/authorize'),
          method: corbel.request.method.POST,
          data: this.params.data,
          contentType: this.params.contentType,
          noRedirect: redirect ? redirect : true
        })
        .then(function (res) {
          if (corbel.Services.getLocation(res)) {

            var req = {
              url: corbel.Services.getLocation(res)
            };

            if (setCookie) {
              req.headers = {
                RequestCookie: 'true'
              };
              req.withCredentials = true;
            }

            return that.request(req);
          }
          else {
            return res.data;
          }
        });
    },

    /**
     * Sign out from oauth server
     * @method
     * @memberOf corbel.Oauth.SignOutBuilder
     * @return {Promise}     promise that resolves empty when the sign out process completes or rejects with a {@link CorbelError}
     */
    signout: function () {
      console.log('oauthInterface.authorization.signOut');
      delete this.params.data;
      return this.request({
        url: this._buildUri(this.uri + '/signout'),
        method: corbel.request.method.GET,
        withCredentials: true
      }).then(function (res) {
        return corbel.Services.getLocationId(res);
      });
    },

    _buildUri: corbel.Oauth._buildUri
  });

})();
