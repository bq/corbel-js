//@exclude
'use strict';
//@endexclude

(function() {

    var NotificationsDomainBuilder = corbel.Notifications.NotificationsDomainBuilder = corbel.Services.inherit({

        /**
         * Creates a new NotificationsDomainBuilder
         * @return {corbel.Notification.NotificationDomainBuilder}
         */
        constructor: function(driver) {
            this.driver = driver;
            this.uri = 'domain';
        },
        /*
         * Creates a new notification domain
         * @method
         * @memberOf Corbel.Notifications.NotificationsDomainBuilder
         * @param {Object} notification                 Contains the data of the new notification
         * @param {String} notification.properties      Notification domain properties
         * @param {String} notification.templates       Notification templates
         *
         * @return {Promise}                    Promise that resolves in the new notification domain id or rejects with a {@link CorbelError}
         */
        create: function(domain) {
            console.log('notificationsInterface.domain.create', domain);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: domain
            }).
            then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },
        /**
         * Gets a notification domain
         * @method
         * @memberOf Corbel.Notifications.NotificationsDomainBuilder
         * @return {Promise}              Promise that resolves to a Notification {Object} or rejects with a {@link CorbelError}
         */
        get: function() {
            console.log('notificationsInterface.domain.get');
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.GET
            });
        },
        /**
         * Updates a notification domain
         * @method
         * @memberOf Corbel.Notifications.NotificationsDomainBuilder
         * @param  {Object} data                    Data to be updated
         *
         * @return {Promise}                        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        update: function(data) {
            console.log('notificationsInterface.domain.update', data);
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.PUT,
                data: data
            });
        },
        /**
         * Deletes a notification domain
         * @method
         * @memberOf Corbel.Notifications.NotificationsDomainBuilder
         * @return {Promise}        Promise that resolves to undefined (void) or rejects with a {@link CorbelError}
         */
        delete: function() {
            console.log('notificationsInterface.domain.delete');
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.DELETE
            });
        },

        _buildUri: function(path) {
            var urlBase =  this.driver.config.getCurrentEndpoint(corbel.Notifications.moduleName, this._buildPort(this.driver.config));

            return urlBase + path;       
        },

        _buildPort: function(config) {
          return config.get('notificationsPort', null) || corbel.Notifications.defaultPort;
        }

    }, {

        moduleName: 'notifications',

        create: function(driver) {
            return new corbel.NotificationsDomainBuilder(driver);
        }

    });

    return NotificationsDomainBuilder;

})();
