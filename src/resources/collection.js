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
    corbel.Resources.Collection = corbel.Resources.ResourceBase.inherit({

        constructor: function(type, driver) {
            this.type = type;
            this.driver = driver;
        },

        /**
         * Gets a collection of elements, filtered, paginated or sorted
         * @method
         * @memberOf Resources.CollectionBuilder
         * @param  {String} dataType            Type of the request data
         * @param  {Object} params              Params of the silkroad request
         * @return {Promise}                    ES6 promise that resolves to an {Array} of Resources or rejects with a {@link SilkRoadError}
         * @see {@link corbel.util.serializeParams} to see a example of the params
         */
        get: function(dataType, params) {
            // console.log('resourceInterface.collection.get', params);
            return this.request({
                url: this.buildUri(this.type),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null,
                Accept: dataType
            });
        },

        /**
         * Adds a new element to a collection
         * @method
         * @memberOf Resources.CollectionBuilder
         * @param  {String} dataType   Mime type of the added data
         * @param  {Object} data       The element to be added
         * @return {Promise}           ES6 promise that resolves to the new resource id or rejects with a {@link SilkRoadError}
         */
        add: function(dataType, data) {
            return this.request({
                url: this.buildUri(this.type),
                method: corbel.request.method.POST,
                contentType: dataType,
                Accept: dataType,
                data: data
            }).then(function(res) {
                return corbel.Services.extractLocationId(res);
            });
        }

    });

    return corbel.Resources.Collection;

})();
