//@exclude
'use strict';
//@endexclude

(function() {

    var NotificationsBuilder = corbel.Notifications.NotificationsBuilder = corbel.Services.inherit({

        /**
         * Creates a new NotificationsBuilder
         * @param  {String} id String with the asset id or 'all' key
         * @return {Assets}
         */
        constructor: function(id) {
            this.uri = 'notification';
            this.id = id;
        },
        /*
         * Creates a new notification
         * @method
         * @memberOf Corbel.Notifications.NotificationsBuilder
         * @param {Object} notification                Contains the data of the new notification
         * @param {String} notification.type    Notification type (mail,  sms...)
         * @param {String} notification.text    Notification content
         * @param {String} notification.sender  Notification sender
         * @param {String} [notification.title] Notification title
         *
         * @return {Promise}                    Promise that resolves in the new notification id or rejects with a {@link CorbelError}
         */
        create: function(notification) {
            console.log('notificationsInterface.notification.create', notification);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: notification
            }).
            then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Gets a notification
         * @method
         * @memberOf Corbel.Notifications.NotificationsBuilder
         * @param  {Object} [params]      Params of the corbel request
         * @return {Promise}              Promise that resolves to a Notification {Object} or rejects with a {@link CorbelError}
         */
        get: function(params) {
            console.log('notificationsInterface.notification.get', params);
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },
        /**
         * Updates a notification
         * @method
         * @memberOf Corbel.Notifications.NotificationsBuilder
         * @param  {Object} data                    Data to be updated
         *
         * @return {Promise}                        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        update: function(data) {
            console.log('notificationsInterface.notification.update', data);
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.PUT,
                data: data
            });
        },
        /**
         * Deletes a notification
         * @method
         * @memberOf Corbel.Notifications.NotificationsBuilder
         * @return {Promise}        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        delete: function() {
            console.log('notificationsInterface.notification.delete');
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
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
        sendNotification: function(notification) {
             console.log('notificationsInterface.notification.sendNotification', notification);
            this.uri += 'send';
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: notification
            });
        },

        _buildUri: function(path, id) {
            var uri = '',
                urlBase = this.driver.config.get('notificationsEndpoint', null) ?
                this.driver.config.get('notificationsEndpoint') :
                this.driver.config.get('urlBase')
                  .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Notifications.moduleName)
                  .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, this._buildPort(this.driver.config));

            uri = urlBase + path;
            if (id) {
                uri += '/' + id;
            }
            return uri;
        },

        _buildPort: function(config) {
          return config.get('notificationsPort', null) || corbel.Notifications.defaultPort;
        }

    }, {

        moduleName: 'notifications',

        create: function(driver) {
            return new corbel.NotificationsBuilder(driver);
        }

    });

    return NotificationsBuilder;

})();
