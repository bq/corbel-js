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

    corbel.Config = Config;

    corbel.Config.isNode = typeof module !== 'undefined' && module.exports;

    /**
     * Client type
     * @type {String}
     * @default
     */
    corbel.Config.clientType = corbel.Config.isNode ? 'NODE' : 'WEB';
    corbel.Config.wwwRoot = !corbel.Config.isNode ? root.location.protocol + '//' + root.location.host + root.location.pathname : 'localhost';

    /**
     * Returns all application config params
     * @return {Object}
     */
    corbel.Config.create = function(config) {
        return new corbel.Config(config);
    };

    /**
     * Returns all application config params
     * @return {Object}
     */
    corbel.Config.prototype.getConfig = function() {
        return this.config;
    };

    /**
     * Overrides current config with params object config
     * @param {Object} config An object with params to set as new config
     */
    corbel.Config.prototype.setConfig = function(config) {
        this.config = corbel.utils.extend(this.config, config);
        return this;
    };

    /**
     * Gets a specific config param
     * @param  {String} field config param name
     * @param  {Mixed} defaultValue Default value if undefined
     * @return {Mixed}
     */
    corbel.Config.prototype.get = function(field, defaultValue) {
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
    corbel.Config.prototype.set = function(field, value) {
        this.config[field] = value;
    };

})();
