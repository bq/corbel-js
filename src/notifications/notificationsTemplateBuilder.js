(function() {
//@exclude
'use strict';
//@endexclude

    corbel.Notifications.NotificationsTemplateBuilder = corbel.Notifications.BaseNotifications.inherit({

        /**
         * Creates a new NotificationsTemplateBuilder
         * @param  {String} id of the notification template
         * @return {corbel.Notification.NotificationTemplateBuilder}
         */
        constructor: function(driver, id) {
            this.driver = driver;
            this.uri = 'notification';
            this.id = id;
        },
        /*
         * Creates a new notification template
         * @method
         * @memberOf Corbel.Notifications.NotificationsTemplateBuilder
         * @param {Object} notification         Contains the data of the new notification
         * @param {String} notification.type    Notification type (mail,  sms...)
         * @param {String} notification.text    Notification content
         * @param {String} notification.sender  Notification sender
         * @param {String} [notification.title] Notification title
         *
         * @return {Promise}                    Promise that resolves in the new notification id or rejects with a {@link CorbelError}
         */
        create: function(notification) {
            console.log('notificationsInterface.template.create', notification);
            return this.request({
                url: this.buildUri(this.uri),
                method: corbel.request.method.POST,
                data: notification
            }).
            then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Gets a notification template
         * @method
         * @memberOf Corbel.Notifications.NotificationsTemplateBuilder
         * @param  {Object} [params]      Params of the corbel request
         * @return {Promise}              Promise that resolves to a Notification {Object} or rejects with a {@link CorbelError}
         */
        get: function(params) {
            console.log('notificationsInterface.template.get', params);
            return this.request({
                url: this.buildUri(this.uri, this.id),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },
        /**
         * Updates a notification template
         * @method
         * @memberOf Corbel.Notifications.NotificationsTemplateBuilder
         * @param  {Object} data                    Data to be updated
         *
         * @return {Promise}                        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        update: function(data) {
            console.log('notificationsInterface.template.update', data);
            corbel.validate.value('id', this.id);
            return this.request({
                url: this.buildUri(this.uri, this.id),
                method: corbel.request.method.PUT,
                data: data
            });
        },
        /**
         * Deletes a notification template
         * @method
         * @memberOf Corbel.Notifications.NotificationsTemplateBuilder
         * @return {Promise}        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        delete: function() {
            console.log('notificationsInterface.template.delete');
            corbel.validate.value('id', this.id);
            return this.request({
                url: this.buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
        }

    }, {

        moduleName: 'notifications',

        create: function(driver) {
            return new corbel.NotificationsTemplateBuilder(driver);
        }

    });

    return corbel.Notifications.NotificationsTemplateBuilder;

})();
