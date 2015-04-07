(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    corbel.Resources.ResourceBase = corbel.Services.inherit({

        /**
         * Helper function to build the request uri
         * @param  {String} srcType     Type of the resource
         * @param  {String} srcId       Id of the resource
         * @param  {String} relType     Type of the relationed resource
         * @param  {String} destId      Information of the relationed resource
         * @return {String}             Uri to perform the request
         */
        buildUri: function(srcType, srcId, destType, destId) {

            var urlBase = this.driver.config.get('resourcesEndpoint', null) ?
                this.driver.config.get('resourcesEndpoint') :
                this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, 'resources');

            var uri = urlBase + 'resource/' + srcType;

            if (srcId) {
                uri += '/' + srcId;
                if (destType) {
                    uri += '/' + destType;
                    if (destId) {
                        uri += ';r=' + destType + '/' + destId;
                    }
                }
            }

            return uri;
        },

        request: function(args) {
            var params = corbel.utils.extend(this.params, args);

            this.params = {}; //reset instance params

            args.query = corbel.utils.serializeParams(params);

            return corbel.Services.prototype.request.apply(this, [args].concat(Array.prototype.slice.call(arguments, 1))); //call service request implementation
        },

        getURL: function(params) {
            return this.buildUri(this.type, this.srcId, this.destType) + (params ? '?' + corbel.utils.serializeParams(params) : '');
        },

        getDefaultOptions: function(options) {
            options = options || {};

            return options;
        }

    });

    corbel.utils.extend(corbel.Resources.ResourceBase.prototype, corbel.requestParamsBuilder.prototype); // extend for inherit requestParamsBuilder methods extensible for all Resources object

    return corbel.Resources.ResourceBase;

})();
