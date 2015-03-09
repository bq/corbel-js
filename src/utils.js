(function() {
    //@exclude

    'use strict';
    /* global corbel */

    //@endexclude


    /**
     * A module to some library utils.
     * @exports validate
     * @namespace
     * @memberof app
     */
    var utils = corbel.utils = {};

    /**
     * Extend a given object with all the properties in passed-in object(s).
     * @param  {Object}  obj
     * @return {Object}
     */
    utils.extend = function(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    utils.reload = function() {
        // console.log('utils.reload');
        if (window) {
            window.location.reload();
        }
    };

    return utils;

})();