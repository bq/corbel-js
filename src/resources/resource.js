(function() {
    //@exclude
    'use strict';
    /*globals corbel */
    //@endexclude

    /**
     * Builder for resource requests
     * @class
     * @memberOf resources
     * @param  {String} type    The resource type
     * @param  {String} id      The resource id
     */
    corbel.Resources.Resource = corbel.Resources.ResourceBase.inherit({

        constructor: function(type, id, driver) {
            this.type = type;
            this.id = id;
            this.driver = driver;
        },

        /**
         * Gets a resource
         * @method
         * @memberOf resources.ResourceBuilder
         * @param  {String} [dataType="application/json"]                Mime type of the expected resource
         * @param  {Object} [params]                Additional request parameters
         * @param  {String} [params.binaryType]     XMLHttpRequest 2 responseType value ('blob'|'arraybuffer'|undefined)
         * @return {Promise}                        ES6 promise that resolves to a Resource {Object} or rejects with a {@link SilkRoadError}
         * @see {@link services.request} to see a example of the params
         */
        get: function(dataType, params) {
            // console.log('resourceInterface.resource.get', dataType);
            var args = params || {};
            args.url = this.buildUri(this.type, this.id);
            args.method = corbel.request.method.GET;
            args.contentType = dataType;
            args.Accept = dataType;
            return this.request(args);
        },

        /**
         * Updates a resource
         * @method
         * @memberOf resources.ResourceBuilder
         * @param  {Object} data                    Data to be updated
         * @param  {Object} [params]                Additional request parameters
         * @param  {String} [params.binaryType]     XMLHttpRequest 2 content type value for the sending content ('blob'|'arraybuffer'|undefined)
         * @param  {String} dataType                Mime tipe of the sent data
         * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
         * @see {@link services.request} to see a example of the params
         */
        update: function(dataType, data, params) {
            // console.log('resourceInterface.resource', data);
            var args = params || {};
            args.url = this.buildUri(this.type, this.id);
            args.method = corbel.request.method.PUT;
            args.data = data;
            args.contentType = dataType;
            args.Accept = dataType;
            return this.request(args);
        },

        /**
         * Deletes a resource
         * @method
         * @memberOf Resources.ResourceBuilder
         * @param  {String} dataType    Mime tipe of the delete data
         * @return {Promise}            ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
         */
        delete: function(dataType) {
            // console.log('resourceInterface.resource.delete');
            return this.request({
                url: this.buildUri(this.type, this.id),
                method: corbel.request.method.DELETE,
                contentType: dataType,
                Accept: dataType
            });
        }

    });

    return corbel.Resources.Resource;

})();
