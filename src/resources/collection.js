(function() {

    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    /**
     * Builder for collection requests
     * @class
     * @memberOf Resources
     * @param {String} type The collection type
     * @param {CorbelDriver} corbel instance
     */
    function CollectionBuilder(type, driver) {
        this.type = type;
        this.driver = driver;
    }

    //expose CollectionBuilder into corbel.Resources namespace
    corbel.Resources._collectionBuilder = CollectionBuilder;



    CollectionBuilder.prototype.buildUri = corbel.Resources.buildUri;

    CollectionBuilder.prototype.getURL = corbel.Resources.getURL;

    /**
     * Gets a collection of elements, filtered, paginated or sorted
     * @method
     * @memberOf Resources.CollectionBuilder
     * @param  {Object} params              Params of the silkroad request
     * @param  {String} dataType            Type of the request data
     * @return {Promise}                    ES6 promise that resolves to an {Array} of Resources or rejects with a {@link SilkRoadError}
     * @see {@link corbel.util.serializeParams} to see a example of the params
     */
    CollectionBuilder.prototype.get = function(params, dataType) {
        // console.log('resourceInterface.collection.get', params);
        return corbel.Resources.request({
            url: this.buildUri(this.type),
            method: corbel.services.method.GET,
            query: params ? corbel.utils.serializeParams(params) : null,
            Accept: dataType
        });
    };

    /**
     * Adds a new element to a collection
     * @method
     * @memberOf Resources.CollectionBuilder
     * @param  {Object} data       The element to be added
     * @param  {String} dataType   Mime type of the added data
     * @return {Promise}           ES6 promise that resolves to the new resource id or rejects with a {@link SilkRoadError}
     */
    CollectionBuilder.prototype.add = function(data, dataType) {
        // console.log('resourceInterface.collection.add', data);
        return corbel.services.requestXHR({
            url: this.buildUri(this.type),
            method: corbel.services.method.POST,
            contentType: dataType,
            Accept: dataType,
            data: data,
            withAuth: true
        }).then(function(res) {
            return corbel.services.extractLocationId(res);
        });
    };

    return CollectionBuilder;

})();