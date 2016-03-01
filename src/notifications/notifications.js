(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Notifications = corbel.Object.inherit({

        constructor: function(driver) {
            this.driver = driver;
        },

        template: function(id) {
            return new corbel.Notifications.NotificationsTemplateBuilder(this.driver, id);
        },

        domain: function() {
            return new corbel.Notifications.NotificationsDomainBuilder(this.driver);
        },

        notification: function() {
            return new corbel.Notifications.NotificationsBuilder(this.driver);
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
