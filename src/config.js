//@exclude
'use strict';
/* globals corbel, root */
//@endexclude

(function() {

    function Config(config) {
        config = config || {};
        // config default values
        this.config = {};

        corbel.utils.extend(this.config, config);
    }

    Config.URL_BASE_PLACEHOLDER = '{{module}}';

    corbel.Config = Config;

    Config.isNode = typeof window === 'undefined' && typeof module !== 'undefined' && module.exports;

    /**
     * Client type
     * @type {String}
     * @default
     */
    Config.clientType = Config.isNode ? 'NODE' : 'WEB';
    Config.wwwRoot = !Config.isNode ? root.location.protocol + '//' + root.location.host + root.location.pathname : 'localhost';

    /**
     * Returns all application config params
     * @return {Object}
     */
    Config.create = function(config) {
        return new Config(config);
    };

    /**
     * Returns all application config params
     * @return {Object}
     */
    Config.prototype.getConfig = function() {
        return this.config;
    };

    /**
     * Overrides current config with params object config
     * @param {Object} config An object with params to set as new config
     */
    Config.prototype.setConfig = function(config) {
        this.config = corbel.utils.extend(this.config, config);
        return this;
    };

    /**
     * Gets a specific config param
     * @param  {String} field config param name
     * @param  {Mixed} defaultValue Default value if undefined
     * @return {Mixed}
     */
    Config.prototype.get = function(field, defaultValue) {
        if (this.config[field] === undefined) {
            if (defaultValue === undefined) {
                throw new Error('config:undefined:' + field + '');
            } else {
                return defaultValue;
            }
        }

        return this.config[field];
    };

    /**
     * Sets a new value for specific config param
     * @param {String} field Config param name
     * @param {Mixed} value Config param value
     */
    Config.prototype.set = function(field, value) {
        this.config[field] = value;
    };

})();
