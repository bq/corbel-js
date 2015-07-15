//@exclude
'use strict';
//@endexclude

(function() {

    var EventBuilder = corbel.Evci.EventBuilder = corbel.Services.inherit({
        /**
         * Creates a new EventBuilder
         * @param  {String} type
         * @return {Events}
         */
        constructor: function(type, driver) {
            this.uri = 'event';
            this.eventType = type;
            this.driver = driver;
        },

        /**
         * Publish a new event.
         *
         * @method
         * @memberOf corbel.Evci.EventBuilder
         *
         * @param {Object} eventData  The data of the event.
         *
         * @return {Promise} A promise with the id of the created scope or fails
         *                   with a {@link corbelError}.
         */
        publish: function(eventData) {
            if (!eventData) {
                throw new Error('Send event require data');
            }
            console.log('evciInterface.publish', eventData);
            return this.request({
                url: this._buildUri(this.uri,this.eventType),
                method: corbel.request.method.POST,
                data: eventData
            }).then(function(res) {
                res.data = corbel.Services.getLocationId(res);
                return res;
            });
        },

        _buildUri: function(path,eventType) {
            var uri = '',
                urlBase = this.driver.config.get('evciEndpoint', null) ?
                this.driver.config.get('evciEndpoint') :
                this.driver.config.get('urlBase')
                  .replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Evci.moduleName)
                  .replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, this._buildPort(this.driver.config));

            uri = urlBase + path;
            if (eventType) {
                uri += '/' + eventType;
            }
            return uri;
        },

        _buildPort: function(config) {
          return config.get('evciPort', null) || corbel.Evci.defaultPort;
        }

    }, {

        moduleName: 'evci',

        create: function(driver) {
            return new corbel.EventBuilder(driver);
        }

    });

    return EventBuilder;
})();
