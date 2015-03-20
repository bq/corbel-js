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

        return new corbel._ResourcesBuilder(driver);

    };

    return corbel.Resources;

})();