(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Evci = corbel.Object.inherit({

        /**
         * Create a new EventBuilder
         * @param  {String} type String
         * @return {Events}
         */
        constructor: function(driver) {
            this.driver = driver;

            return function(type) {
                var builder = new corbel.Evci.EventBuilder(type);
                builder.driver = driver;
                return builder;
            };
        },


    }, {

        moduleName: 'evci',

        create: function(driver) {
            return new corbel.Evci(driver);
        }

    });

    return corbel.Evci;

})();

