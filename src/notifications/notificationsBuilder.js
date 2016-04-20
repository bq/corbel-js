//@exclude
'use strict';
//@endexclude

(function() {

    var NotificationsBuilder = corbel.Notifications.NotificationsBuilder = corbel.Notifications.BaseNotifications.inherit({

        /**
         * Creates a new NotificationsBuilder
         * @return {corbel.Notification.NotificationBuilder}
         */
        constructor: function(driver) {
            this.driver = driver;
            this.uri = 'notification';
        },

        /**
         * Send a notification
         * @method
         * @memberOf Corbel.Notifications.NotificationsBuilder
         * @param {Object} notification         Notification
         * @param {String} notification.notificationId    Notification id (mail,  sms...)
         * @param {String} notification.recipient    Notification recipient
         * @param {Object} notification.propierties    Notification propierties
         * @return {Promise}        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        send: function(notification) {
            console.log('notificationsInterface.notification.sendNotification', notification);
            this.uri += '/send';
            return this.request({
                url: this.buildUri(this.uri),
                method: corbel.request.method.POST,
                data: notification
            });
        }

    }, {

        moduleName: 'notifications',

        create: function(driver) {
            return new corbel.NotificationsBuilder(driver);
        }

    });

    return NotificationsBuilder;

})();
