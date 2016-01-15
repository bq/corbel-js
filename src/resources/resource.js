(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    /**
     * Builder for resource requests
     * @class
     * @memberOf resources
     * @param  {String} type    The resource type
     * @param  {String} id      The resource id
     */
    corbel.Resources.Resource = corbel.Resources.BaseResource.inherit({

        constructor: function(type, id, driver, params) {
            this.type = type;
            this.id = id;
            corbel.validate.values(['type', 'id'], this);

            this.driver = driver;
            this.params = params || {};
        },

        /**
         * Gets a resource
         * @method
         * @memberOf resources.Resource
         * @param  {Object} options
         * @param  {String} [options.dataType]      Mime type of the expected resource
         * @param  {Object} [options.params]        Additional request parameters
         * @return {Promise}                        ES6 promise that resolves to a Resource {Object} or rejects with a {@link CorbelError}
         * @see {@link services.request} to see a example of the params
         */
        get: function(options) {
            options = this.getDefaultOptions(options);
            

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type, this.id),
                method: corbel.request.method.GET,
                contentType: options.dataType,
                Accept: options.dataType
            });

            return this.request(args);
        },
        

        /**
         * Updates a resource
         * @method
         * @memberOf resources.Resource
         * @param  {Object} data                    Data to be updated
         * @param  {Object} options
         * @param  {String} [options.dataType]      Mime tipe of the sent data
         * @param  {Object} [options.params]        Additional request parameters
         * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         * @see {@link services.request} to see a example of the params
         */
        update: function(data, options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type, this.id),
                method: corbel.request.method.PUT,
                data: data,
                contentType: options.dataType,
                Accept: options.dataType
            });

            return this.request(args);
        },
        

        /**
         * Updates the ACL of a resource
         * @method
         * @memberOf resources.Resource
         * @param  {Object} acl                    Acl to be updated
         * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        updateAcl: function(acl) {
            var args = {
                url: this.buildUri(this.type, this.id),
                method: corbel.request.method.PUT,
                data: acl,
                Accept: 'application/json+acl'
            };

            return this.request(args);
        },

        /**
         * Deletes a resource
         * @method
         * @memberOf resources.Resource
         * @param  {Object} options
         * @param  {Object} [options.dataType]      Mime tipe of the delete data
         * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        delete: function(options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type, this.id),
                method: corbel.request.method.DELETE,
                contentType: options.dataType,
                Accept: options.dataType
            });

            return this.request(args);
        }
    });

    return corbel.Resources.Resource;

})();
