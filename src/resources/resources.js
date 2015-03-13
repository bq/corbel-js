(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude


    /**
     * constant with diferents sort posibilities
     * @namespace
     */
    corbel.Resources = {
        sort: {
            /**
             * Ascending sort
             * @type {String}
             * @constant
             * @default
             */
            ASC: 'asc',
            /**
             * Descending sort
             * @type {String}
             * @constant
             * @default
             */
            DESC: 'desc'
        },
        /**
         * constant for use to specify all resources wildcard
         * @namespace
         */
        ALL: '_'
    };


    function ResourcesBuilder(driver) {
        this.driver = driver;
    }

    corbel.Resources.create = function(driver) {

        return new ResourcesBuilder(driver);

    };

    ResourcesBuilder.prototype.collection = function(type) {
        return new corbel.Resources._collectionBuilder(type, this.driver);
    };

    ResourcesBuilder.prototype.resource = function(type, id) {
        return new corbel.Resources._resourceBuilder(type, id, this.driver);
    };

    ResourcesBuilder.prototype.relation = function(srcType, srcId, destType) {
        return new corbel.Resources._relationBuilder(srcType, srcId, destType, this.driver);
    };


    /**
     * Helper function to build the request uri
     * @param  {String} srcType     Type of the resource
     * @param  {String} srcId       Id of the resource
     * @param  {String} relType     Type of the relationed resource
     * @param  {String} destId      Information of the relationed resource
     * @return {String}             Uri to perform the request
     */
    corbel.Resources.buildUri = function(srcType, srcId, destType, destId) {
        var uri = this.driver.config.get('resourcesEndpoint') + 'resource/' + srcType;
        if (srcId) {
            uri += '/' + srcId;
            if (destType) {
                uri += '/' + destType;
                if (destId) {
                    uri += ';r=' + destType + '/' + destId;
                }
            }
        }
        return uri;
    };


    corbel.Resources.getURL = function(params) {
        return this.buildUri(this.type, this.srcId, this.destType) + (params ? '?' + corbel.utils.serializeParams(params) : '');
    };

    corbel.Resources.request = function(params) {
        params.withAuth = true;
        return corbel.services.request(params);
    };


    return ResourcesBuilder;


})();