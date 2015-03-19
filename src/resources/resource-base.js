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
            var uri = this.driver.config.get('resourcesEndpoint') + 'resource/' + srcType;
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

        getURL: function(params) {
            return this.buildUri(this.type, this.srcId, this.destType) + (params ? '?' + corbel.utils.serializeParams(params) : '');
        }

    });

    return corbel.Resources.ResourceBase;

})();
