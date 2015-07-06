(function() {

    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    /**
     * Collection requests
     * @class
     * @memberOf Resources
     * @param {String} type The collection type
     * @param {CorbelDriver} corbel instance
     */
    corbel.Resources.Collection = corbel.Resources.BaseResource.inherit({

        constructor: function(type, driver, params) {
            this.type = type;
            this.driver = driver;
            this.params = params || {};
        },

        /**
         * Gets a collection of elements, filtered, paginated or sorted
         * @method
         * @memberOf Resources.CollectionBuilder
         * @param  {object} options             Get options for the request
         * @return {Promise}                    ES6 promise that resolves to an {Array} of Resources or rejects with a {@link CorbelError}
         * @see {@link corbel.util.serializeParams} to see a example of the params
         */
        get: function(options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type),
                method: corbel.request.method.GET,
                Accept: options.dataType
            });

            return this.request(args);
        },

        /**
         * Adds a new element to a collection
         * @method
         * @memberOf Resources.CollectionBuilder
         * @param  {object} data      Data array added to the collection
         * @param  {object} options     Options object with dataType request option
         * @return {Promise}            ES6 promise that resolves to the new resource id or rejects with a {@link CorbelError}
         */
        add: function(data, options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type),
                method: corbel.request.method.POST,
                contentType: options.dataType,
                Accept: options.dataType,
                data: data
            });

            return this.request(args).then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },

         /**
         * Delete a collection
         * @method
         * @memberOf Resources.CollectionBuilder
         * @param  {object} options     Options object with dataType request option
         * @return {Promise}            ES6 promise that resolves to the new resource id or rejects with a {@link CorbelError}
         */
        delete: function(options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
                url: this.buildUri(this.type),
                method: corbel.request.method.DELETE,
                contentType: options.dataType,
                Accept: options.dataType
            });

            return this.request(args);
        }

    });

    return corbel.Resources.Collection;

})();