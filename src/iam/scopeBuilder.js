//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Creates a ScopeBuilder for scope managing requests.
     * @param {String} id Scope id.
     * @return {corbel.Iam.ScopeBuilder}
     */
    corbel.Iam.prototype.scope = function(id) {
        var scope = new ScopeBuilder(id);
        scope.driver = this.driver;
        return scope;
    };

    /**
     * A builder for scope management requests.
     *
     * @param {String} id Scope id.
     *
     * @class
     * @memberOf iam
     */
    var ScopeBuilder = corbel.Iam.ScopeBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.id = id;
            this.uri = 'scope';
        },

        _buildUri: corbel.Iam._buildUri,

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
        create: function(scope) {
            console.log('iamInterface.scope.create', scope);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: scope
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },

        /**
         * Gets a scope.
         *
         * @method
         * @memberOf corbel.Iam.ScopeBuilder
         *
         * @return {Promise} A promise with the scope or fails with a {@link corbelError}.
         */
        get: function() {
            console.log('iamInterface.scope.get', this.id);
            corbel.validate.value('id', this.id);

            return this.request({
                url: this._buildUri(this.uri + '/' + this.id),
                method: corbel.request.method.GET
            });
        },

        /**
         * Removes a scope.
         *
         * @method
         * @memberOf corbel.Iam.ScopeBuilder
         * @return {Promise} A promise user or fails with a {@link corbelError}.
         */
        remove: function() {
            console.log('iamInterface.scope.remove', this.id);
            corbel.validate.value('id', this.id);
            
            return this.request({
                url: this._buildUri(this.uri + '/' + this.id),
                method: corbel.request.method.DELETE
            });
        }

    });

})();
