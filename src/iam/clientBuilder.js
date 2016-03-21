//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * Creates a ClientBuilder for client managing requests.
   *
   * @param {String} clientId Client id (optional).
   *
   * @return {corbel.Iam.ClientBuilder}
   */
  corbel.Iam.prototype.client = function(clientId) {
    var client = new ClientBuilder(clientId);
    client.driver = this.driver;
    return client;
  };

  /**
   * A builder for client management requests.
   *
   * @param {String} clientId Client id.
   *
   * @class
   * @memberOf iam
   */
  var ClientBuilder = corbel.Iam.ClientBuilder = corbel.Services.inherit({

    constructor: function(clientId) {
      this.clientId = clientId;
      this.uri = 'client';
    },

    /**
     * Adds a new client.
     *
     * @method
     * @memberOf corbel.Iam.ClientBuilder
     *
     * @param {Object} client                          The client data.
     * @param {String} client.id                       Client id.
     * @param {String} client.name                     Client domain (obligatory).
     * @param {String} client.key                      Client key (obligatory).
     * @param {String} client.version                  Client version.
     * @param {String} client.signatureAlghorithm      Signature alghorithm.
     * @param {Object} client.scopes                   Scopes of the client.
     * @param {String} client.clientSideAuthentication Option for client side authentication.
     * @param {String} client.resetUrl                 Reset password url.
     * @param {String} client.resetNotificationId      Reset password notification id.
     *
     * @return {Promise} A promise with the id of the created client or fails
     *                   with a {@link corbelError}.
     */
    create: function(client) {
      console.log('iamInterface.client.create', client);
      return this.request({
        url: this._buildUriWithDomain(this.uri),
        method: corbel.request.method.POST,
        data: client
      }).then(function(res) {
        return corbel.Services.getLocationId(res);
      });
    },

    /**
     * Gets a client.
     *
     * @method
     * @memberOf corbel.Iam.ClientBuilder
     *
     * @param {String} clientId Client id.
     *
     * @return {Promise} A promise with the client or fails with a {@link corbelError}.
     */
    get: function() {
      console.log('iamInterface.client.get', this.clientId);
      corbel.validate.value('clientId', this.clientId);
      return this.request({
        url: this._buildUriWithDomain(this.uri, this.clientId),
        method: corbel.request.method.GET
      });
    },

    /**
     * Gets all clients by domain.
     *
     * @method
     * @memberOf corbel.Iam.ClientBuilder
     * @param  {object} options             Get options for the request
     * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
     * @see {@link corbel.util.serializeParams} to see a example of the params
     */
    getAll: function(params) {
      corbel.validate.failIfIsDefined(this.clientId, 'This function not allowed client identifier');
      console.log('iamInterface.client.getAll');
      return this.request({
        url: this._buildUriWithDomain(this.uri),
        method: corbel.request.method.GET,
        query: params ? corbel.utils.serializeParams(params) : null
      });
    },

    /**
     * Updates a client.
     *
     * @method
     * @memberOf corbel.Iam.ClientBuilder
     *
     * @param {Object} client                          The client data.
     * @param {String} client.name                     Client domain (obligatory).
     * @param {String} client.key                      Client key (obligatory).
     * @param {String} client.version                  Client version.
     * @param {String} client.signatureAlghorithm      Signature alghorithm.
     * @param {Object} client.scopes                   Scopes of the client.
     * @param {String} client.clientSideAuthentication Option for client side authentication.
     * @param {String} client.resetUrl                 Reset password url.
     * @param {String} client.resetNotificationId      Reset password notification id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    update: function(client) {
      console.log('iamInterface.client.update', client);
      corbel.validate.value('clientId', this.clientId);
      return this.request({
        url: this._buildUriWithDomain(this.uri + '/' + this.clientId),
        method: corbel.request.method.PUT,
        data: client
      });
    },

    /**
     * Removes a client.
     *
     * @method
     * @memberOf corbel.Iam.ClientBuilder
     *
     * @param {String} clientId The client id.
     *
     * @return {Promise} A promise or fails with a {@link corbelError}.
     */
    remove: function() {
      console.log('iamInterface.client.remove', this.clientId);
      corbel.validate.value('clientId', this.clientId);

      return this.request({
        url: this._buildUriWithDomain(this.uri + '/' + this.clientId),
        method: corbel.request.method.DELETE
      });
    },

    _buildUriWithDomain: corbel.Iam._buildUriWithDomain

  });

})();
