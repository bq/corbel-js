(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Resources = corbel.Object.inherit({

        constructor: function(driver) {
            this.driver = driver;
        },

        collection: function(type) {
            return new corbel.Resources.Collection(type, this.driver);
        },

        resource: function(type, id) {
            return new corbel.Resources.Resource(type, id, this.driver);
        },

        relation: function(srcType, srcId, destType) {
            return new corbel.Resources.Relation(srcType, srcId, destType, this.driver);
        }

    }, {

        moduleName: 'resources',

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
        ALL: '_',

        create: function(driver) {
            return new corbel.Resources(driver);
        }

    });

    return corbel.Resources;

})();