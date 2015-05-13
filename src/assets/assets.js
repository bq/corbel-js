(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Assets = corbel.Object.inherit({

        /**
         * Creates a new AssetsBuilder
         * @param  {String} id String with the asset id or 'all' key
         * @return {Assets}
         */
        constructor: function(driver) {
            this.driver = driver;

            return function(id) {
                var builder = new corbel.Assets.AssetsBuilder(id);
                builder.driver = driver;
                return builder;
            };
        },


    }, {

        moduleName: 'assets',

        create: function(driver) {
            return new corbel.Assets(driver);
        }

    });

    return corbel.Assets;

})();
