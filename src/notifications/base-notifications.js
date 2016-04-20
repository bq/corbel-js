(function() {
    //@exclude
    'use strict';
    //@endexclude

    corbel.Notifications.BaseNotifications = corbel.Services.inherit({

        /**
         * Helper function to build the request uri
         * @param  {String} srcType     Type of the resource
         * @param  {String} srcId       Id of the resource
         * @param  {String} relType     Type of the relationed resource
         * @param  {String} destId      Information of the relationed resource
         * @return {String}             Uri to perform the request
         */
        buildUri: function(uri, id) {
          var urlBase = this.driver.config.getCurrentEndpoint(corbel.Notifications.moduleName, this._buildPort(this.driver.config));

          var domain = this.driver.config.get(corbel.Iam.IAM_DOMAIN, 'unauthenticated');
          var customDomain = this.driver.config.get(corbel.Domain.CUSTOM_DOMAIN, domain);

          this.driver.config.set(corbel.Domain.CUSTOM_DOMAIN, undefined);

          var uriWithDomain = urlBase + customDomain + '/' + uri;

          if (id) {
            uriWithDomain += '/' + id;
          }

          return uriWithDomain;
        },

        _buildPort: function(config) {
          return config.get('notificationsPort', null) || corbel.Notifications.defaultPort;
        }

    });


    return corbel.Notifications.BaseNotifications;

})();
