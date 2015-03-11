(function() {

    //@exclude
    'use strict';
    /* globals corbel, root */
    //@endexclude

    /**
     * Application global common, config and params
     * @exports common
     * @namespace
     * @memberof corbel
     */
    corbel.common = {};

    var isNode = typeof module !== 'undefined' && module.exports;

    /**
     * Config data structure
     * @namespace
     */
    corbel.common.config = {

        /**
         * Client type
         * @type {String}
         * @default
         */
        clientType: isNode ? 'NODE' : 'WEB',

        /**
         * WebApp root URL
         * @type {String}
         * @default
         */
        wwwRoot: !isNode ? root.location.protocol + '//' + root.location.host + root.location.pathname : 'localhost'
    };

    /**
     * Returns all application config params
     * @return {Object}
     */
    corbel.common.getConfig = function() {
        return this.config;
    };

    /**
     * Overrides current config with params object config
     * @param {Object} config An object with params to set as new config
     */
    corbel.common.setConfig = function(config) {
        this.config = corbel.utils.extend(this.config, config);
        return this;
    };

    /**
     * Gets a specific config param
     * @param  {String} field config param name
     * @return {Mixed}
     */
    corbel.common.get = function(field) {
        if (this.config[field] === undefined) {
            throw new Error('UndefinedCommonField "' + field + '"');
        }

        return this.config[field];
    };

    /**
     * Gets a specific config param or default
     * @param  {String} field config param name
     * @param  {String} defaultValue return value when config param is undefined
     * @return {Mixed}
     */
    corbel.common.getOrDefault = function(field, defaultValue) {
        return this.config[field] || defaultValue;
    };


    /**
     * Sets a new value for specific config param
     * @param {String} field Config param name
     * @param {Mixed} value Config param value
     */
    corbel.common.set = function(field, value) {
        this.config[field] = value;
    };

})();
