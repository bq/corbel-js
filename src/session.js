//@exclude

'use strict';

/*globals corbel */

//deps: [corbel.Object]


//@endexclude


(function() {

    /**
     * A module to manage session data.
     * @exports session
     * @namespace
     * @memberof corbel
     */
    corbel.Session = corbel.Object.inherit({
        constructor: function(driver) {
            this.driver = driver;
            this.status = '';
            //Set localStorage in node-js enviroment
            if (corbel.__env__ === 'node') {
                var LocalStorage = require('node-localstorage').LocalStorage,
                    fs = require('fs');

                if (fs.existsSync(corbel.Session.SESSION_PATH_DIR) === false) {
                    fs.mkdirSync(corbel.Session.SESSION_PATH_DIR);
                }

                if (fs.existsSync(corbel.Session.SESSION_PATH_DIR + '/' + this.driver.guid) === false) {
                    fs.mkdirSync(corbel.Session.SESSION_PATH_DIR + '/' + this.driver.guid);
                }

                this.localStorage = new LocalStorage(corbel.Session.SESSION_PATH_DIR + '/' + this.driver.guid);

                process.on('exit', function() {
                    // if (this.isPersistent() === false) {
                    this.destroy();
                    this.removeDir();
                    // }
                }.bind(this));

            } else {
                this.localStorage = localStorage;
            }

            //Set sessionStorage in node-js enviroment
            if (typeof sessionStorage === 'undefined' || sessionStorage === null) {
                this.sessionStorage = this.localStorage;
            } else {
                this.sessionStorage = sessionStorage;
            }
        },
        /**
         * Sets an application status to STATUS_SELECTOR
         * @param {String} status Name of the status
         * @param {Boolean} active true if active, false id disabled
         */
        setStatus: function(status, active) {
            if ( /*corbel.enviroment === 'node'*/ typeof module !== 'undefined' && module.exports) {
                if (active) {
                    this.status = status;
                } else {
                    this.status = 'not-' + status;
                }
            } else {
                if (active) {
                    $(this.STATUS_SELECTOR).removeClass('not-' + status).addClass(status);
                } else {
                    $(this.STATUS_SELECTOR).removeClass(status).addClass('not-' + status);
                }
            }

            return this;
        },

        /**
         * Removes a specific status from STATUS_SELECTOR
         * @param  {String} status
         */
        removeStatus: function(status) {
            if ( /*corbel.enviroment === 'node'*/ typeof module !== 'undefined' && module.exports) {
                this.status = '';
            } else {
                $(this.STATUS_SELECTOR).removeClass(status).removeClass('not-' + status);
            }
        },

        /**
         * Gets a specific session value
         * @param  {String} key
         * @return {String|Number|Boolean}
         */
        get: function(key) {

            key = key || 'session';

            var storage = this.localStorage;
            if (!this.isPersistent()) {
                storage = this.sessionStorage;
            }

            try {
                return JSON.parse(storage.getItem(key));
            } catch (e) {
                return storage.getItem(key);
            }
        },

        /**
         * Adds a key-value in the user session
         * @param {String} key
         * @param {String|Number|Boolean} value
         * @param {Boolean} [forcePersistent] Force to save value in localStorage
         */
        add: function(key, value, forcePersistent) {
            var storage = this.sessionStorage;

            if (this.isPersistent() || forcePersistent) {
                storage = localStorage;
            }

            if (corbel.validate.isObject(value)) {
                value = JSON.stringify(value);
            }
            if (value === undefined) {
                storage.removeItem(key);
            } else {
                storage.setItem(key, value);
            }
        },

        /**
         * Checks active sessions and updates the app status
         * @return {Boolean}
         */
        gatekeeper: function() {
            var exist = this.exist();

            if (exist) {
                this.setStatus('logged', true);
            } else {
                this.setStatus('logged', false);
            }

            return exist;
        },

        /**
         * Checks when a session exists
         * @return {Boolean}
         */
        exist: function() {
            // TODO: Do it better, diff between anonymous and real user
            // Setted at user.login()
            return this.get('loggedTime') ? true : false;
        },

        /**
         * Creates a user session data
         * @param  {Object} args
         * @param  {Boolean} args.persistent
         * @param  {String} args.accessToken
         * @param  {String} args.oauthService
         * @param  {Object} args.user
         */
        logged: function(args) {
            corbel.validate.isValue(args.accessToken, 'Missing accessToken');
            corbel.validate.isValue(args.refreshToken, 'Missing refreshToken');
            corbel.validate.isValue(args.expiresAt, 'Missing expiresAt');
            corbel.validate.isValue(args.user, 'Missing user');
            corbel.validate.isValue(args.oauthService || args.loginBasic, 'Missing oauthService and loginBasic');

            this.setPersistent(args.persistent);

            this.add('accessToken', args.accessToken);
            this.add('refreshToken', args.refreshToken);
            this.add('expiresAt', args.expiresAt);
            this.add('oauthService', args.oauthService);
            this.add('loginBasic', args.loginBasic);
            this.add('loggedTime', new Date().getTime());
            this.add('user', args.user);

            this.setStatus('logged', true);
        },

        /**
         * Proxy call for session.add(key, undefined)
         * @since 1.6.0
         * @param  {String} key
         */
        remove: function(key) {
            this.add(key);
        },

        removeDir: function() {
            if ( /*corbel.enviroment === 'node'*/ typeof module !== 'undefined' && module.exports) {
                var fs = require('fs');
                try {
                    fs.rmdirSync(corbel.Session.SESSION_PATH_DIR + '/' + this.driver.guid);
                } catch (ex) {}
            }
        },

        /**
         * Checks if the current session is persistent or not
         * @return {Boolean}
         */
        isPersistent: function() {
            return (this.localStorage.persistent ? true : false);
        },

        /**
         * Creates a user session with
         * @param {Boolean} persistent
         */
        setPersistent: function(persistent) {
            if (persistent) {
                this.localStorage.setItem('persistent', persistent);
            } else {
                this.localStorage.removeItem('persistent');
            }
        },

        /**
         * Move a session value to a persistent value (if exists)
         * @param  {String} name
         */
        persist: function(name) {
            var value = this.sessionStorage.getItem(name);
            if (value) {
                this.localStorage.setItem(name, value);
                this.sessionStorage.removeItem(name);
            }
        },

        /**
         * Clears all user storage and remove storage dir for nodejs /*
         */
        destroy: function() {
            this.localStorage.clear();
            if ( /*corbel.enviroment === 'node'*/ typeof module !== 'undefined' && module.exports) {

            } else {
                this.sessionStorage.clear();
            }

            this.setStatus('logged', false);
        }
    }, {
        SESSION_PATH_DIR: './storage',

        /**
         * Static factory method for session object
         * @param  {corbel.Driver} corbel-js driver
         * @return {corbel.session}
         */
        create: function(driver) {
            return new corbel.Session(driver);
        }
    });

    return corbel.Session;

})();