//@exclude
'use strict';

/* globals corbel */

//@endexclude

function Config(config) {
    config = config || {};
    // config default values
    this.config = {};

    corbel.utils.extend(this.config, config);
}

Config.URL_BASE_PLACEHOLDER = '{{module}}';
Config.URL_BASE_PORT_PLACEHOLDER = '{{modulePort}}';

corbel.Config = Config;

var processExist = function(){
  return typeof(process) !== 'undefined' || {}.toString.call(process) === '[object process]';
};


if (typeof module !== 'undefined' && module.exports && processExist() && typeof window === 'undefined' ) {
    Config.__env__ = process.env.NODE_ENV === 'browser' ? 'browser' : 'node';
} else {
    Config.__env__ = 'browser';
}


Config.isNode = Config.__env__ === 'node';

Config.isBrowser = Config.__env__ === 'browser';

/**
 * Client type
 * @type {String}
 * @default
 */
Config.clientType = Config.isNode ? 'NODE' : 'WEB';

if (Config.isNode || !window.location) {
    Config.wwwRoot = 'localhost';
} else {
    Config.wwwRoot = window.location.protocol + '//' + window.location.host + window.location.pathname;
}

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

Config.prototype.getCurrentEndpoint = function(moduleName, port){
    var moduleEndpoint = moduleName + 'Endpoint';
    var endpoint = this.get(moduleEndpoint, null) ?
        this.get(moduleEndpoint) :
        this.get('urlBase');
    endpoint = endpoint.replace(corbel.Config.URL_BASE_PLACEHOLDER, moduleName);
    if (port) {
        endpoint = endpoint.replace(corbel.Config.URL_BASE_PORT_PLACEHOLDER, port);
    }
    return endpoint;
};


/**
 * Sets a new value for specific config param
 * @param {String} field Config param name
 * @param {Mixed} value Config param value
 */
Config.prototype.set = function(field, value) {
    this.config[field] = value;
};
