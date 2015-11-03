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
        },

        notification: function(id) {
            return new corbel.Notifications.NotificationsBuilder(this.driver, id);
        }

    }, {

        moduleName: 'notifications',
        defaultPort: 8094,

        create: function(driver) {
            return new corbel.Notifications(driver);
        }

    });

    return corbel.Notifications;

})();
