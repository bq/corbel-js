// @exclude
'use strict'
// @endexclude
/* global corbel */

;(function () {
  /**
   * A module to make Oauth requests.
   * @exports Oauth
   * @namespace
   * @memberof app.corbel
   */

  var Oauth = corbel.Oauth = function (driver) {
    this.driver = driver
  }

  Oauth.moduleName = 'oauth'
  Oauth.defaultPort = 8084

  Oauth.create = function (driver) {
    return new Oauth(driver)
  }
  /**
   * Private method to build a string uri
   * @private
   * @param  {String} uri
   * @return {String}
   */
  Oauth._buildUri = function (uri) {
    var urlBase = this.driver.config.getCurrentEndpoint(Oauth.moduleName, corbel.Oauth._buildPort(this.driver.config))

    return urlBase + uri
  }

  Oauth._buildPort = function (config) {
    return config.get('oauthPort', null) || corbel.Oauth.defaultPort
  }

  /**
   * Default encoding
   * @type {String}
   * @default application/x-www-form-urlencoded; charset=UTF-8
   */
  Oauth._URL_ENCODED = 'application/x-www-form-urlencoded; charset=UTF-8'

  Oauth._checkProp = function (dict, keys, excep) {
    var error = !excep ? 'Error validating arguments' : excep
    if (!dict) {
      throw new Error(error)
    }
    for (var i in keys) {
      if (!(keys[i] in dict)) {
        throw new Error(error)
      }
    }
  }

  Oauth._validateResponseType = function (responseType) {
    if (['code', 'token'].indexOf(responseType) < 0) {
      throw new Error('Only "code" or "token" response type allowed')
    }
  }

  Oauth._validateGrantType = function (grantType) {
    if (grantType !== 'authorization_code') {
      throw new Error('Only "authorization_code" grant type is allowed')
    }
  }

  Oauth._trasformParams = function (clientParams) {
    for (var key in clientParams) {
      var keyWithUnderscores = this._toUnderscore(key)
      if (key !== keyWithUnderscores) {
        clientParams[keyWithUnderscores] = clientParams[key]
        delete clientParams[key]
      }
    }
    return clientParams
  }

  Oauth._toUnderscore = function (string) {
    return string.replace(/([A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase()
    })
  }
})()
