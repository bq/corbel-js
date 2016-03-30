//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * A module to some library corbel.utils
   * @exports utils
   * @namespace
   * @memberof corbel
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
   * Set up the prototype chain, for subclasses. Uses a hash of prototype properties and class properties to be extended.
   * @param  {Object} Prototype object properties
   * @param  {Object} Static object properties
   * @return {Object} Return a new object that inherit from the context object
   */
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
   * Generate a uniq random GUID
   */
  utils.guid = function() {

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };

  /**
   * Reload browser
   */
  utils.reload = function() {
    if (window !== undefined) {
      window.location.reload();
    }
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


  utils.toURLEncoded = function(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  };

  /**
   * Translate this full exampe query to a Corbel Compliant QueryString
   * @param {Object} params
   * @param {Object} params.aggregation
   * @param {Object} params.query
   * @param {Object} params.condition
   * @param {Object} params.pagination
   * @param {Number} params.pagination.page
   * @param {Number} params.pagination.pageSize
   * @param {Object} params.sort
   * @param {String} params.search
   * @param {Boolean} params.indexFieldsOnly
   * @return {String}
   * @example
   * var params = {
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
   *     queries: [{
   *        query: [
   *           { '$eq': {field: 'value'} },
   *           { '$eq': {field2: 'value2'} },
   *           { '$gt': {field: 'value'} },
   *           { '$gte': {field: 'value'} },
   *           { '$lt': {field: 'value'} },
   *           { '$lte': {field: 'value'} },
   *           { '$ne': {field: 'value'} },
   *           { '$eq': {field: 'value'} },
   *           { '$like': {field: 'value'} },
   *           { '$in': {field: ['value1', 'value2']} },
   *           { '$all': {field: ['value1', 'value2']} }
   *       ],
   *       queryDomain: 'api',  // 'api', '7digital' supported
   *     },{
   *        query: [
   *           { '$eq': {field: 'value'} },
   *           { '$eq': {field2: 'value2'} },
   *           { '$gt': {field: 'value'} },
   *           { '$gte': {field: 'value'} },
   *           { '$lt': {field: 'value'} },
   *           { '$lte': {field: 'value'} },
   *           { '$ne': {field: 'value'} },
   *           { '$eq': {field: 'value'} },
   *           { '$like': {field: 'value'} },
   *           { '$in': {field: ['value1', 'value2']} },
   *           { '$all': {field: ['value1', 'value2']} }
   *       ],
   *       queryDomain: 'api',  // 'api', '7digital' supported
   *     }]
   *     page: { page: 0, pageSize: 10 },
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

    if (!(params instanceof Object) && (typeof params !== 'object')) {
      throw new Error('expected params to be an Object type, but got ' + typeof params);
    }

    function getJsonEncodedStringify(param) {
      return encodeURIComponent(JSON.stringify(param));    
    }

    if (params.aggregation) {
      result = 'api:aggregation=' + getJsonEncodedStringify(params.aggregation);
    }

    function queryObjectToString(params, key) {
      var result = '';
      var query;
      params.queryDomain = params.queryDomain || 'api';
      result += params.queryDomain + ':' + key + '=';
      try {
        if (typeof params[key] === 'string') {
          query = JSON.parse(params[key]);
        } else {
          //Clone the object we don't want to modify the original query object
          query = JSON.parse(JSON.stringify(params[key]));
        }   

        result += getJsonEncodedStringify(query);

        return result;
      } catch (e) {
        //Return the query even if it is not a valid object
        return result + params[key];
      }
    }

    if (params.query) {
      params.queryDomain = params.queryDomain || 'api';
      result += result ? '&' : '';
      result += queryObjectToString(params, 'query');
    }

    if (params.queries) {
      params.queries.forEach(function(query) {
        result += result ? '&' : '';
        result += queryObjectToString(query, 'query');
      });
    }

    if (params.condition) {
      params.queryDomain = params.queryDomain || 'api';
      result += result ? '&' : '';
      result += queryObjectToString(params, 'condition');
    }

    if (params.conditions) {
      params.conditions.forEach(function(condition) {
        result += result ? '&' : '';
        result += queryObjectToString(condition, 'condition');
      });
    }

    if (params.search) {
      result += result ? '&' : '';

      result += 'api:search=';
      if (params.search instanceof Object) {
        result += getJsonEncodedStringify(params.search);
      } else {
        result += encodeURIComponent(params.search);
      }

      if (params.hasOwnProperty('indexFieldsOnly')) {
        result += '&api:indexFieldsOnly=' + getJsonEncodedStringify(params.indexFieldsOnly);
      }
    }

    if (params.distinct) {
      result += result ? '&' : '';
      result += 'api:distinct=' + encodeURIComponent((params.distinct instanceof Array ? params.distinct.join(',') : params.distinct));
    }

    if (params.sort) {
      result += result ? '&' : '';
      result += 'api:sort=' + getJsonEncodedStringify(params.sort);
    }

    if (params.pagination) {
      if (params.pagination.page || params.pagination.page === 0) {
        result += result ? '&' : '';
        result += 'api:page=' + params.pagination.page;
      }

      if (params.pagination.pageSize || params.pagination.pageSize === 0) {
        result += result ? '&' : '';
        result += 'api:pageSize=' + params.pagination.pageSize;
      }
    }

    if (params.customQueryParams) {
      Object.keys(params.customQueryParams).forEach(function(param) {
        result += result ? '&' : '';
        result += param + '=' + encodeURIComponent(params.customQueryParams[param]);
      });
    }

    return result;
  };

  utils.defaults = function(destiny, defaults) {
    Object.keys(defaults).forEach(function(key) {
      if (typeof(destiny[key]) === 'undefined') {
        destiny[key] = defaults[key];
      }
    });

    return destiny;
  };

  utils.pick = function(object, keys) {
    var destiny = {};

    keys.forEach(function(key) {
      destiny[key] = object[key];
    });

    return destiny;
  };

  utils.clone = function clone(item) {
    if (!item) {
      return item;
    } // null, undefined values check

    var types = [Number, String, Boolean],
      result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
      if (item instanceof type) {
        result = type(item);
      }
    });

    if (typeof result === 'undefined') {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        result = [];
        item.forEach(function(child, index) {
          result[index] = clone(child);
        });
      } else if (typeof item === 'object') {
        // testing that this is DOM
        if (item.nodeType && typeof item.cloneNode === 'function') {
          result = item.cloneNode(true);
        } else if (!item.prototype) { // check that this is a literal
          if (item instanceof Date) {
            result = new Date(item);
          } else {
            // it is an object literal
            result = {};
            for (var i in item) {
              result[i] = clone(item[i]);
            }
          }
        } else {
          // depending what you would like here,
          // just keep the reference, or create new object
          if (false && item.constructor) {
            // would not advice to do that, reason? Read below
            result = new item.constructor();
          } else {
            result = item;
          }
        }
      } else {
        result = item;
      }
    }

    return result;
  };

  /**
   * Change the keys of the object to lowercase due to
   * compatibility reasons
   * @param  {Object} obj object which keys will converted to lowercase
   * @return {Object}
   */
  utils.keysToLowerCase = function(obj) {
    if (obj === undefined || obj === null){
      return obj;  
    } else {
      var key;
      var keys = Object.keys(obj);
      var n = keys.length;
      var newobj = {};
      while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
      }
      return newobj;
    }
  };

  utils.isJSON = function(string) {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }

    return true;
  };

  utils.isStream = function(data){
    if (data.pipe && typeof data.pipe === 'function') {
      return true;
    } else {
      return false;
    }
  };

  utils.arrayToObject = function(array) {
      var object = {};
      array.map(function(element, index){
          object[index] = element;
      });
      return object;
  };

  /**
   * Creates a copy of Array with the same inner elements
   * @param  {Array} list The original array to copy
   * @return {Array}  A copy version of the array
   */
  utils.copyArray = function(list) {
    var newList = new Array(list.length);
    var i = list.length;
    while(i--) { 
      newList[i] = list[i]; 
    }
    return newList;
  };

  /**
   * Convert data URI to Blob.
   * Only works in browser
   * @param  {string} dataURI
   * @return {Blob}
   */
  utils.dataURItoBlob = function(dataURI) {

    var serialize;
    if (corbel.Config.isNode) {
      console.log('NODE');
      // node environment
      serialize = require('atob');
    } else {
      console.log('BROWSER');
      serialize = root.atob;
    }

    /*
     * phantom hack.
     * https://github.com/ariya/phantomjs/issues/11013
     * https://developers.google.com/web/updates/2012/06/Don-t-Build-Blobs-Construct-Them
     * https://code.google.com/p/phantomjs/issues/detail?id=1013
     * Phrantom has ton Blob() constructor support,
     * use BlobBuilder instead.
     */
    var BlobBuilder;
    var BlobConstructor;
    if (corbel.Config.isBrowser) {
      BlobBuilder = window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder;
      BlobConstructor = window.Blob;
    }

    // convert base64 to raw binary data held in a string
    var byteString = serialize(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }
    var blob;
    if (BlobBuilder) {
      blob = new BlobBuilder();
      blob.append(arrayBuffer);
      blob = blob.getBlob(mimeString);
    } else {
      blob = new BlobConstructor([_ia], {
        type: mimeString
      });
    }
    return blob;
  };

  /**
   * Checks if times between client and server has a delay below the @common.MAX_TIME_DELTA thereshold
   * @param {Number} [maxDelay=common.MAX_TIME_DELTA] Time in seconds for delay thereshold
   * @return {Promise} A promise that resolves if the delay is under @common.MAX_TIME_DELTA, otherwise it fails
   */

  utils.isInTime = function(driver, maxDelay) {
    var MAX_TIME_DELTA = 60 * 10;

    var checkDelay = function(response) {
      var local = new Date();
      var server = new Date(response.headers.date);
      var delay = Math.abs(local.valueOf() - server.valueOf());

      if (delay > maxDelay) {
        throw new Error('error:client-time:delay');
      }

      return delay;
    };

    maxDelay = (maxDelay || MAX_TIME_DELTA) * 1000;

    return corbel.request
      .send({
        url: driver.config.getCurrentEndpoint('iam').replace(/v\d.\d\//, '') + 'version',
        method: corbel.request.method.OPTIONS
      })
      .then(function(response) {
        return checkDelay(response);
      })
      .catch(function(error) {
        if (!error) {
          throw new Error('error:server:not-available');
        }
        return checkDelay(error);
    });
  };
  return utils;

})();
