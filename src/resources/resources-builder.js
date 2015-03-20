(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel._ResourcesBuilder = corbel.Object.inherit({
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
    });

    return corbel._ResourcesBuilder;

})();