// @exclude
'use strict'
// @endexclude
/* global corbel */

;(function () {
  /**
   * Creates a DomainBuilder for domain managing requests.
   *
   * @param {String} domainId Domain id.
   *
   * @return {corbel.Iam.DomainBuilder}
   */
  corbel.Iam.prototype.domain = function (domainId) {
    var domain = new DomainBuilder(domainId)
    domain.driver = this.driver
    return domain
  }

  /**
   * A builder for domain management requests.
   *
   * @param {String} domainId Domain id (optional).
   *
   * @class
   * @memberOf iam
   */
  var DomainBuilder = corbel.Iam.DomainBuilder = corbel.Services.inherit({
    constructor: function (domainId) {
      this.domainId = domainId
      this.uri = 'domain'
    },

    _buildUri: corbel.Iam._buildUri,

    /**
     * Creates a new domain.
     *
     * @method
     * @memberOf corbel.Iam.DomainBuilder
     *
     * @param {Object} domain                    The domain data.
     * @param {String} domain.description        Description of the domain.
     * @param {String} domain.authUrl            Authentication url.
     * @param {String} domain.allowedDomains     Allowed domains.
     * @param {String} domain.scopes             Scopes of the domain.
     * @param {String} domain.defaultScopes      Default copes of the domain.
     * @param {Object} domain.authConfigurations Authentication configuration.
     * @param {Object} domain.userProfileFields  User profile fields.
     *
     * @return {Promise} A promise with the id of the created domain or fails
     *                   with a {@link corbelError}.
     */
    create: function (domain) {
      console.log('iamInterface.domain.create', domain)
      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.POST,
        data: domain
      }).then(function (res) {
        return corbel.Services.getLocationId(res)
      })
    },

    /**
     * Gets a domain.
     *
     * @method
     * @memberOf corbel.Iam.DomainBuilder
     *
     * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
     */
    get: function () {
      console.log('iamInterface.domain.get', this.domainId)
      corbel.validate.value('domainId', this.domainId)

      return this.request({
        url: this._buildUri(this.uri + '/' + this.domainId),
        method: corbel.request.method.GET
      })
    },

    /**
     * Gets all domains.
     *
     * @method
     * @memberOf corbel.Iam.DomainBuilder
     * @param  {object} params             Get options for the request
     * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
     * @see {@link corbel.util.serializeParams} to see a example of the params
     */
    getAll: function (params) {
      corbel.validate.failIfIsDefined(this.domainId, 'This function not allowed domain identifier')
      console.log('iamInterface.domain.getAll')
      return this.request({
        url: this._buildUri(this.uri),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      })
    },

    /**
     * Updates a domain.
     *
     * @method
     * @memberOf corbel.Iam.DomainBuilder
     *
     * @param {Object} domain                    The domain data.
     * @param {String} domain.description        Description of the domain.
     * @param {String} domain.authUrl            Authentication url.
     * @param {String} domain.allowedDomains     Allowed domains.
     * @param {String} domain.scopes             Scopes of the domain.
     * @param {String} domain.defaultScopes      Default copes of the domain.
     * @param {Object} domain.authConfigurations Authentication configuration.
     * @param {Object} domain.userProfileFields  User profile fields.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    update: function (domain) {
      console.log('iamInterface.domain.update', domain)
      corbel.validate.value('domainId', this.domainId)

      return this.request({
        url: this._buildUri(this.uri + '/' + this.domainId),
        method: corbel.request.method.PUT,
        data: domain
      })
    },

    /**
     * Removes a domain.
     *
     * @method
     * @memberOf corbel.Iam.DomainBuilder
     *
     * @param {String} domainId The domain id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    remove: function () {
      console.log('iamInterface.domain.remove', this.domainId)
      corbel.validate.value('domainId', this.domainId)

      return this.request({
        url: this._buildUri(this.uri + '/' + this.domainId),
        method: corbel.request.method.DELETE
      })
    }
  })
})()
