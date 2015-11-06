//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Creates a GroupBuilder for group requests
     *
     * @return {iam.GroupBuilder | iam.GroupsBuilder}
     */
    corbel.Iam.prototype.group = function(id) {
        var builder;

        if (id) {
            builder = new GroupBuilder(id);
        } else {
            builder = new GroupsBuilder();
        }

        builder.driver = this.driver;
        return builder;
    };

    /**
     * A builder for group requests without id (getAll and creation).
     *
     * @class
     * @memberOf iam
     */
    var GroupsBuilder = corbel.Iam.GroupsBuilder = corbel.Services.inherit({

        constructor: function() {
            this.uri = 'group';
        },

        _buildUri: corbel.Iam._buildUri,

        /**
         * Get all groups.
         *
         * @method
         * @memberOf iam.GroupBuilder
         *
         * @param {Object} params Query parameters.
         *
         * @return {Promise} Q promise that resolves to an array of groups.
         */
        getAll: function(params) {
            console.log('iamInterface.groups.getAll');
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null,
                withAuth: true
            });
        },

        /**
         * Create a group.
         *
         * @method
         * @memberOf iam.GroupBuilder
         *
         * @param {Object} data The group to create.
         * @param {String} data.name Group name.
         * @param {String} data.domain Group domain.
         * @param {Array} data.scopes Group scopes.
         *
         * @return {Promise} A promise which resolves into the ID of the created group or fails with a {@link SilkRoadError}.
         */
        create: function(data) {
            console.log('iamInterface.groups.create', data);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: data,
                withAuth: true
            }).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        }

    });

    /**
     * A builder for group requests.
     *
     * @class
     * @memberOf iam
     * @param {String} id The id of the group.
     */
    var GroupBuilder = corbel.Iam.GroupBuilder = corbel.Services.inherit({

        constructor: function(id) {
            this.uri = 'group';
            this.id = id;
        },

        _buildUri: corbel.Iam._buildUri,

        /**
         * Get a group.
         *
         * @method
         * @memberOf corbel.Iam.GroupBuilder
         * @return {Promise} Q promise that resolves to a group or rejects with a {@link SilkRoadError}.
         */
        get: function() {
            console.log('iamInterface.group.get');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.GET,
                withAuth: true
            });
        },

        /**
         * Add scopes to a group.
         *
         * @method
         * @memberOf corbel.Iam.GroupBuilder
         *
         * @param {Array} scopes Group scopes to add.
         *
         * @return {Promise} A promise which resolves to undefined(void) or fails with a {@link SilkRoadError}.
         */
        addScopes: function(scopes) {
            console.log('iamInterface.group.addScopes', scopes);
            corbel.validate.value('id', this.id);

            return this.request({
                url: this._buildUri(this.uri, this.id) + '/scopes',
                method: corbel.request.method.PUT,
                data: scopes,
                withAuth: true
            });
        },

        /**
         * Remove a scope from a group.
         *
         * @method
         * @memberOf iam.GroupBuilder
         *
         * @param {String} scope Group scope.
         *
         * @return {Promise} A promise which resolves to undefined(void) or fails with a {@link SilkRoadError}.
         */
        removeScope: function(scope) {
            console.log('iamInterface.group.removeScope', scope);
            corbel.validate.value('id', this.id);

            return this.request({
                url: this._buildUri(this.uri, this.id) + '/scopes/' + scope,
                method: corbel.request.method.DELETE,
                withAuth: true
            });
        },

        /**
         * Delete a group.
         *
         * @method
         * @memberOf iam.GroupBuilder
         * @return {Promise} A promise which resolves to undefined(void) or fails with a {@link SilkRoadError}.
         */
        delete: function() {
            console.log('iamInterface.group.delete');
            corbel.validate.value('id', this.id);
            
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE,
                withAuth: true
            });
        }

    });

})();
