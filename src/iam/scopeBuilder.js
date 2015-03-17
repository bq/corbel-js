//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    /**
     * A builder for scope management requests.
     *
     * @param {String} id Scope id.
     *
     * @class
     * @memberOf iam
     */
    var ScopeBuilder = corbel.Iam.ScopeBuilder = function(id) {
        this.id = id;
        this.uri = 'scope';
    };

    ScopeBuilder.prototype._buildUri = corbel.Iam._buildUri;

    /**
     * Creates a ScopeBuilder for scope managing requests.
     *
     * @param {String} id Scope id.
     *
     * @return {corbel.Iam.ScopeBuilder}
     */
    corbel.Iam.prototype.scope = function(id) {
        var scope = new ScopeBuilder(id);
        scope.driver = this.driver;
        return scope;
    };

    /**
     * Creates a new scope.
     *
     * @method
     * @memberOf corbel.Iam.ScopeBuilder
     *
     * @param {Object} scope        The scope.
     * @param {Object} scope.rules  Scope rules.
     * @param {String} scope.type   Scope type.
     * @param {Object} scope.scopes Scopes for a composite scope.
     *
     * @return {Promise} A promise with the id of the created scope or fails
     *                   with a {@link corbelError}.
     */
    ScopeBuilder.prototype.create = function(scope) {
        console.log('iamInterface.scope.create', scope);
        return corbel.request.send({
            url: this._buildUri(this.uri),
            method: corbel.request.method.POST,
            data: scope,
            withAuth: true
        }).then(function(res) {
            res.data = corbel.services.extractLocationId(res);
            return res;
        });
    };

    /**
     * Gets a scope.
     *
     * @method
     * @memberOf corbel.Iam.ScopeBuilder
     *
     * @return {Promise} A promise with the scope or fails with a {@link corbelError}.
     */
    ScopeBuilder.prototype.get = function() {
        console.log('iamInterface.scope.get', this.id);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.id),
            method: corbel.request.method.GET,
            withAuth: true
        });
    };

    /**
     * Removes a scope.
     *
     * @method
     * @memberOf corbel.Iam.ScopeBuilder
     * @return {Promise} A promise user or fails with a {@link corbelError}.
     */
    ScopeBuilder.prototype.remove = function() {
        console.log('iamInterface.scope.remove', this.id);
        return corbel.request.send({
            url: this._buildUri(this.uri + '/' + this.id),
            method: corbel.request.method.DELETE,
            withAuth: true
        });
    };

})();
