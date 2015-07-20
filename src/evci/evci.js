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
        },

        event: function(type) {
            if (!type) {
                throw new Error('Send event require event type');
            }
            return new corbel.Evci.EventBuilder(type, this.driver);
        }


    }, {

        moduleName: 'evci',
        defaultPort: 8086,

        create: function(driver) {
            return new corbel.Evci(driver);
        }

    });

    return corbel.Evci;

})();
