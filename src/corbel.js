//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * @namespace
     * @memberOf corbel
     * @param {object} config
     * @return {CorbelDriver}
     */
    function CorbelDriver(config, events, guid) {
        this._events = events || [];
        // create instance config
        this.guid = guid || corbel.utils.guid();
        this.config = corbel.Config.create(config);

        // create isntance modules with injected driver
        this.iam = corbel.Iam.create(this);
        this.resources = corbel.Resources.create(this);
        this.assets = corbel.Assets.create(this);
        this.oauth = corbel.Oauth.create(this);
        this.notifications = corbel.Notifications.create(this);
        this.ec = corbel.Ec.create(this);
        this.evci = corbel.Evci.create(this);
        this.borrow = corbel.Borrow.create(this);
        this.composr = corbel.CompoSR.create(this);
        this.domain = corbel.Domain.create(this);
    }

    /**
     * @return {CorbelDriver} A new instance of corbel driver with the same config
     */ 
    CorbelDriver.prototype.clone = function() {
        return new CorbelDriver(this.config.getConfig(), this._events, this.guid);
    };

    /**
     * Adds an event handler for especific event
     * @param {string}   name Event name
     * @param {Function} fn   Function to call
     */
    CorbelDriver.prototype.addEventListener = function(name, fn) {
        if (typeof fn !== 'function') {
            throw new Error('corbel:error:invalid:type');
        }
        this._events[name] = this._events[name] || [];
        if (this._events[name].indexOf(fn) === -1) {
            this._events[name].push(fn);
        }
    };

    /**
     * Removes the handler from event list
     * @param  {string}   name Event name
     * @param  {Function} fn   Function to remove
     */
    CorbelDriver.prototype.removeEventListener = function(name, fn) {
        if (this._events[name]) {
            var index = this._events[name].indexOf(fn);
            if (index !== -1) {
                this._events[name].splice(index, 1);
            }
        }
    };

    /**
     * Fires all events handlers for an specific event name
     * @param  {string} name    Event name
     * @param  {Mixed} options  Data for event handlers
     */
    CorbelDriver.prototype.dispatch = function(name, options) {
        if (this._events[name] && this._events[name].length) {
            this._events[name].forEach(function(fn) {
                fn(options);
            });
        }
    };

    /**
     * Adds an event handler for especific event
     * @see CorbelDriver.prototype.addEventListener
     * @param {string}   name Event name
     * @param {Function} fn   Function to call
     */
    CorbelDriver.prototype.on = CorbelDriver.prototype.addEventListener;

    /**
     * Removes the handler from event list
     * @see CorbelDriver.prototype.removeEventListener
     * @param  {string}   name Event name
     * @param  {Function} fn   Function to remove
     */
    CorbelDriver.prototype.off = CorbelDriver.prototype.removeEventListener;

    /**
     * Fires all events handlers for an specific event name
     * @see CorbelDriver.prototype.dispatch
     * @param  {string} name    Event name
     * @param  {Mixed} options  Data for event handlers
     */
    CorbelDriver.prototype.trigger = CorbelDriver.prototype.dispatch;

    corbel.CorbelDriver = CorbelDriver;

    /**
     * Instanciates new corbel driver
     * @memberOf corbel
     * @param {object} config
     * @param {string} config.urlBase
     * @param {string} [config.clientId]
     * @param {string} [config.clientSecret]
     * @param {string} [config.scopes]
     * @return {corbel.CorbelDriver}
     */
    corbel.getDriver = function(config) {
        config = config || {};

        if (!config.urlBase) {
            throw new Error('error:undefined:urlbase');
        }

        return new CorbelDriver(config);
    };

})();
