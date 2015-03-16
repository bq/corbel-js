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


    corbel.Resources.create = function(driver) {

        return new ResourcesBuilder(driver);

    };


    function ResourcesBuilder(driver) {
        this.driver = driver;
    }

    ResourcesBuilder.prototype.collection = function(type) {
        return new corbel.Resources.Collection(type, this.driver);
    };

    ResourcesBuilder.prototype.resource = function(type, id) {
        return new corbel.Resources.Resource(type, id, this.driver);
    };

    ResourcesBuilder.prototype.relation = function(srcType, srcId, destType) {
        return new corbel.Resources.Relation(srcType, srcId, destType, this.driver);
    };


    return corbel.Resources;

})();