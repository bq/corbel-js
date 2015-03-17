//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {
	

    /**
     * A builder for client management requests.
     *
     * @param {String} domainId Domain id.
     * @param {String} clientId Client id.
     *
     * @class
     * @memberOf iam
     */
    var ClientBuilder = corbel.Iam.ClientBuilder = function(domainId, clientId) {
        this.domainId = domainId;
        this.clientId = clientId;
        this.uri = 'domain';
    };

    ClientBuilder.prototype._buildUri = corbel.Iam._buildUri;

    /**
     * Creates a ClientBuilder for client managing requests.
     *
     * @param {String} domainId Domain id (optional).
     * @param {String} clientId Client id (optional).
     *
     * @return {corbel.Iam.ClientBuilder}
     */
    corbel.Iam.prototype.client = function(domainId, clientId) {
        var client = new ClientBuilder(domainId, clientId);
        client.driver = this.driver;
        return client;
    };

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
    ClientBuilder.prototype.create = function(client) {
        console.log('iamInterface.domain.create', client);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.domainId + '/client'),
            method: corbel.request.method.POST,
            data: client,
            withAuth: true
        }).then(function(res) {
            res.data = corbel.services.extractLocationId(res);
            return res;
        });
    };

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
    ClientBuilder.prototype.get = function() {
        console.log('iamInterface.domain.get', this.clientId);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.request.method.GET,
            withAuth: true
        });
    };

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
    ClientBuilder.prototype.update = function(client) {
        console.log('iamInterface.domain.update', client);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.request.method.PUT,
            data: client,
            withAuth: true
        });
    };

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
    ClientBuilder.prototype.remove = function() {
        console.log('iamInterface.domain.remove', this.domainId, this.clientId);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
            method: corbel.request.method.DELETE,
            withAuth: true
        });
    };

})();