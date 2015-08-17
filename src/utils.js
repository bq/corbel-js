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
   * @param {Object} params.page
   * @param {Number} params.page.page
   * @param {Number} params.page.size
   * @param {Object} params.sort
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

    //Encodes each query value for being URI compilant
    function encodeQueryComponents(obj) {
      if (Array.isArray(obj)) {
        obj = obj.map(function(item) {
          return encodeQueryComponents(item);
        });
      } else if (typeof(obj) === 'object') {
        Object.keys(obj).forEach(function(key) {
          obj[key] = encodeQueryComponents(obj[key]);
        });
      } else if (typeof(obj) === 'string') {
        //Return the encoded component (decode first for avoiding double encode)
        obj = encodeURIComponent(decodeURIComponent(obj));
      }
      return obj;
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

        query = JSON.stringify(encodeQueryComponents(query));

        result += query;

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
      result += 'api:search=' + (typeof params.search === 'object' ? JSON.stringify(params.search) : params.search);
    }

    if (params.sort) {
      result += result ? '&' : '';
      result += 'api:sort=' + JSON.stringify(params.sort);
    }

    if (params.pagination) {
      if (params.pagination.page) {
        result += result ? '&' : '';
        result += 'api:page=' + params.pagination.page;
      }

      if (params.pagination.size) {
        result += result ? '&' : '';
        result += 'api:pageSize=' + params.pagination.size;
      }
    }

    if (params.customQueryParams) {
      Object.keys(params.customQueryParams).forEach(function(param) {
        result += result ? '&' : '';
        result += param + '=' + params.customQueryParams[param];
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
      if (!item) { return item; } // null, undefined values check

      var types = [ Number, String, Boolean ], 
          result;

      // normalizing primitives if someone did new String('aaa'), or new Number('444');
      types.forEach(function(type) {
          if (item instanceof type) {
              result = type( item );
          }
      });

      if (typeof result == "undefined") {
          if (Object.prototype.toString.call( item ) === "[object Array]") {
              result = [];
              item.forEach(function(child, index, array) { 
                  result[index] = clone( child );
              });
          } else if (typeof item == "object") {
              // testing that this is DOM
              if (item.nodeType && typeof item.cloneNode == "function") {
                  var result = item.cloneNode( true );    
              } else if (!item.prototype) { // check that this is a literal
                  if (item instanceof Date) {
                      result = new Date(item);
                  } else {
                      // it is an object literal
                      result = {};
                      for (var i in item) {
                          result[i] = clone( item[i] );
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

  utils.isJSON = function(string) {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }

    return true;
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

  return utils;

})();
