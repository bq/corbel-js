(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Notifications = corbel.Object.inherit({

        /**
         * Creates a new NotificationsBuilder
         * @param  {String} id String with the asset id or 'all' key
         * @return {Notifications}
         */
        constructor: function(driver) {
            this.driver = driver;

            return function(id) {
                var builder = new corbel.Notifications.NotificationsBuilder(id);
                builder.driver = driver;
                return builder;
            };
        },


    }, {

        moduleName: 'notifications',
        defaultPort: 8094,

        create: function(driver) {
            return new corbel.Notifications(driver);
        }

    });

    return corbel.Notifications;

})();
