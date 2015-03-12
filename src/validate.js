//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {



    /**
     * A module to make values validation.
     * @exports validate
     * @namespace
     * @memberof app
     */
    corbel.validate = {};

    /**
     * Checks if some value is not undefined
     * @param  {Mixed}  value
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */
    corbel.validate.isDefined = function(value, message) {
        var isUndefined = value === undefined;

        if (isUndefined && message) {
            throw new Error(message);
        }
        return !isUndefined;
    };

    /**
     * Checks if some value is defined and throw error
     * @param  {Mixed}  value
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */

    corbel.validate.failIfIsDefined = function(value, message) {
        var isDefined = value !== undefined;

        if (isDefined && message) {
            throw new Error(message);
        }
        return !isDefined;
    };

    /**
     * Checks whenever value are null or not
     * @param  {Mixed}  value
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */
    corbel.validate.isNotNull = function(value, message) {
        var isNull = value === null;

        if (isNull && message) {
            throw new Error(message);
        }
        return !isNull;
    };

    /**
     * Checks whenever a value is not null and not undefined
     * @param  {Mixed}  value
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */
    corbel.validate.isValue = function(value, message) {
        return this.isDefined(value, message) && this.isNotNull(value, message);
    };

    /**
     * Checks whenever a value is greater than other
     * @param  {Mixed}  value
     * @param  {Mixed}  greaterThan
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */
    corbel.validate.isGreaterThan = function(value, greaterThan, message) {
        var gt = this.isValue(value) && value > greaterThan;

        if (!gt && message) {
            throw new Error(message);
        }
        return gt;
    };

    /**
     * Checks whenever a value is greater or equal than other
     * @param  {Mixed}  value
     * @param  {Mixed} isGreaterThanOrEqual
     * @param  {String}  [message]
     * @throws {Error} If return value is false and message are defined
     * @return {Boolean}
     */
    corbel.validate.isGreaterThanOrEqual = function(value, isGreaterThanOrEqual, message) {
        var gte = this.isValue(value) && value >= isGreaterThanOrEqual;

        if (!gte && message) {
            throw new Error(message);
        }
        return gte;
    };

})();
