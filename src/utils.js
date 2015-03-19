//@exclude
'use strict';
/* globals corbel */
//@endexclude

(function() {

    /**
     * A module to some library corbel.utils.
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

    /**
     * Serialize a plain object to query string
     * @param  {Object} obj Plain object to serialize
     * @return {String}
     */
    utils.param = function(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    };

    utils.inherit = function(prototypeProperties, staticProperties) {
        var parent = this,
            child;


        if (prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
            child = prototypeProperties.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }

        utils.extend(child, parent, staticProperties);

        var Surrogate = function() {
            this.constructor = child;
        };

        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate; // jshint ignore:line

        if (prototypeProperties) {
            utils.extend(child.prototype, prototypeProperties);
        }

        child.__super__ = parent.prototype;

        return child;

    };

    /**
     * Translate this full exampe query to a Silkroad Compliant QueryString
     * @param {Object} params
     * @param {Object} params.aggregation
     * @param {Object} params.query
     * @param {Object} params.page
     * @param {Number} params.page.page
     * @param {Number} params.page.size
     * @param {Object} params.sort
     * @return {String}
     * @example var params = {
     *     query: [
     *         { '$eq': {field: 'value'} },
     *         { '$eq': {field2: 'value2'} },
     *         { '$gt': {field: 'value'} },
     *         { '$gte': {field: 'value'} },
     *         { '$lt': {field: 'value'} },
     *         { '$lte': {field: 'value'} },
     *         { '$ne': {field: 'value'} },
     *         { '$eq': {field: 'value'} },
     *         { '$like': {field: 'value'} },
     *         { '$in': {field: ['value1', 'value2']} },
     *         { '$all': {field: ['value1', 'value2']} }
     *     ],
     *     queryDomain: 'api',  // 'api', '7digital' supported
     *     page: { page: 0, size: 10 },
     *     sort: {field: 'asc'},
     *     aggregation: {
     *         '$count': '*'
     *     }
     * };
     */
    utils.serializeParams = function(params) {
        var result = '';

        if (params === undefined || params === null) {
            return result;
        }

        if (!(params instanceof Object)) {
            throw new Error('expected params to be an Object type, but got ' + typeof params);
        }

        if (params.aggregation) {
            result = 'api:aggregation=' + JSON.stringify(params.aggregation);
        }

        if (params.query) {
            params.queryDomain = params.queryDomain || 'api';
            result += result ? '&' : '';
            result += params.queryDomain + ':query=';
            if (typeof params.query === 'string') {
                result += params.query;
            } else {
                result += JSON.stringify(params.query);
            }
        }

        if (params.search) {
            result += result ? '&' : '';
            result += 'api:search=' + params.search;
        }

        if (params.sort) {
            result += result ? '&' : '';
            result += 'api:sort=' + JSON.stringify(params.sort);
        }

        if (params.page) {
            if (params.page.page) {
                result += result ? '&' : '';
                result += 'api:page=' + params.page.page;
            }

            if (params.page.size) {
                result += result ? '&' : '';
                result += 'api:pageSize=' + params.page.size;
            }
        }

        return result;
    };

    return utils;

})();