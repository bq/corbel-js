//@exclude
'use strict';
//@endexclude

(function() {

  /**
   * Request object available for brwoser and node environment
   * @exports request
   * @namespace
   * @memberof corbel
   */
  var request = corbel.request = {
    /**
     * method constants
     * @namespace
     */
    method: {

      /**
       * GET constant
       * @constant
       * @type {string}
       * @default
       */
      GET: 'GET',
      /**
       * @constant
       * @type {string}
       * @default
       */
      POST: 'POST',
      /**
       * @constant
       * @type {string}
       * @default
       */
      PUT: 'PUT',
      /**
       * @constant
       * @type {string}
       * @default
       */
      DELETE: 'DELETE',
      /**
       * @constant
       * @type {string}
       * @default
       */
      OPTIONS: 'OPTIONS',
      /**
       * @constant
       * @type {string}
       * @default
       */
      PATCH: 'PATCH',
      /**
       * @constant
       * @type {string}
       * @default
       */
      HEAD: 'HEAD'
    }
  };

  /**
   * Serialize handlers
   * @namespace
   */
  request.serializeHandlers = {
    /**
     * JSON serialize handler
     * @param  {object} data
     * @return {string}
     */
    json: function(data) {
      if (typeof data !== 'string') {
        return JSON.stringify(data);
      } else {
        return data;
      }
    },
    /**
     * Form serialize handler
     * @param  {object} data
     * @return {string}
     */
    'form-urlencoded': function(data) {
      return corbel.utils.toURLEncoded(data);
    },
    /**
     * dataURI serialize handler
     * @param  {object} data
     * @return {string}
     */
    dataURI: function(data) {
      if (corbel.Config.isNode) {
        //var buffer = new Buffer(data.split('base64,')[1], 'base64');
      } else {
        return corbel.utils.dataURItoBlob(data);
      }
      // if browser transform to blob
      // if node transform to stream
      return corbel.utils.toURLEncoded(data);
    },
    /**
     * blob serialize handler
     * 'blob' type do not require serialization for browser, expode in node
     * @param  {object} data
     * @return {string}
     */
    blob: function(data) {
      if (corbel.Config.isNode) {
        throw new Error('error:request:unsupported:data_type');
      }
      return data;
    },
    /**
     * stream serialize handler
     * 'stream' type do not require serialization for ndoe, expode in browser
     * @param  {object} data
     * @return {string}
     */
    stream: function(data) {
      if (corbel.Config.isBrowser) {
        throw new Error('error:request:unsupported:data_type');
      }
      return data;
    }
    // @todo: 'url' support
    // 'url' type convert in stream in node, explode in browser
  };

  /**
   * Serialize hada with according contentType handler
   * returns data if no handler available
   * @param  {mixed} data
   * @param  {string} contentType
   * @return {Mixed}
   */
  request.serialize = function(data, contentType) {
    var serialized;
    Object.keys(request.serializeHandlers).forEach(function(type) {
      if (contentType.indexOf(type) !== -1) {
        serialized = request.serializeHandlers[type](data);
      }
    });
    serialized = serialized || data;
    return serialized;
  };

  /**
   * Parse handlers
   * @namespace
   */
  request.parseHandlers = {
    /**
     * JSON parse handler
     * @param  {string} data
     * @return {mixed}
     */
    json: function(data) {
      data = data || '{}';
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      return data;
    }
    // 'blob' type do not require any process
    // @todo: xml
  };

  /**
   * Process the server response data to the specified object/array/blob/byteArray/text
   * @param  {mixed} data                             The server response
   * @param  {string} type='array'|'blob'|'json'      The class of the server response
   * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
   * @return {mixed}                                  Processed data
   */
  request.parse = function(data, responseType, dataType) {
    var parsed;
    Object.keys(request.parseHandlers).forEach(function(type) {
      if (responseType && responseType.indexOf(type) !== -1) {
        parsed = request.parseHandlers[type](data, dataType);
      }
    });
    parsed = parsed || data;
    return parsed;
  };

  /**
   * Public method to make ajax request
   * @param  {object} options                                     Object options for ajax request
   * @param  {string} options.url                                 The request url domain
   * @param  {string} options.method                              The method used for the request
   * @param  {object} options.headers                             The request headers
   * @param  {string} options.responseType                        The response type of the body: `blob` | `undefined`
   * @param  {string} options.contentType                         The content type of the body
   * @param  {boolean} options.withCredentials                    If is needed to set or send cookies
   * @param  {object | uint8array | blob} options.dataType        Optional data sent to the server
   * @param  {function} options.success                           Callback function for success request response
   * @param  {function} options.error                             Callback function for handle error in the request
   * @return {Promise}                                        Promise about the request status and response
   */
  request.send = function(options) {
    options = options || {};

    if (!options.url) {
      throw new Error('undefined:url');
    }

    if (typeof(options.url) !== 'string') {
      throw new Error('invalid:url', options.url);
    }

    var params = {
      method: options.method || request.method.GET,
      url: options.url,
      headers: typeof options.headers === 'object' ? options.headers : {},
      callbackSuccess: options.success && typeof options.success === 'function' ? options.success : undefined,
      callbackError: options.error && typeof options.error === 'function' ? options.error : undefined,
      responseType: options.responseType,
      withCredentials: options.withCredentials || true
    };

    params = rewriteRequestToPostIfUrlLengthIsTooLarge(options, params);
    params.url = encodeURLQueryParamsIfContainsInvalidChars(params.url);

    // default content-type
    params.headers['content-type'] = options.contentType || 'application/json';

    var dataMethods = [request.method.PUT, request.method.POST, request.method.PATCH];
    if (dataMethods.indexOf(params.method) !== -1) {
      params.data = request.serialize(options.data, params.headers['content-type']);
    }

    var promise = new Promise(function(resolve, reject) {

      var resolver = {
        resolve: resolve,
        reject: reject
      };

      if (corbel.Config.isBrowser) {
        //browser
        request._browserAjax.call(this, params, resolver);
      } else {
        //nodejs
        request._nodeAjax.call(this, params, resolver);
      }
    }.bind(this));

    return promise;
  };

  var xhrSuccessStatus = {
    // file protocol always yields status code 0, assume 200
    0: 200,
    // Support: IE9
    // #1450: sometimes IE returns 1223 when it should be 204
    1223: 204
  };

  /**
   * Process server response
   * @param  {object} response
   * @param  {object} resolver
   * @param  {function} callbackSuccess
   * @param  {function} callbackError
   */
  var processResponse = function(response, resolver, callbackSuccess, callbackError) {

    //xhr = xhr.target || xhr || {};
    var statusCode = xhrSuccessStatus[response.status] || response.status,
      statusType = Number(response.status.toString()[0]),
      promiseResponse;

    var data = response.response;
    var headers = corbel.utils.keysToLowerCase(response.headers);

    if (statusType === 4 || response.error) {

        var disconnected = response.error && response.status === 0;
        statusCode = disconnected ? 0 : statusCode;

        if (callbackError) {
          callbackError.call(this, response.error, statusCode, response.responseObject, headers);
        }

        if (response.response) {
          data = request.parse(response.response, response.responseType, response.dataType);
        }

        promiseResponse = {
          data: data,
          status: statusCode,
          error: response.error,
          headers: headers
        };

        promiseResponse[response.responseObjectType] = response.responseObject;

        resolver.reject(promiseResponse);

    } else if (statusType < 3) {

        if (response.response) {
        data = request.parse(response.response, response.responseType, response.dataType);
        }

        if (callbackSuccess) {
        callbackSuccess.call(this, data, statusCode, response.responseObject, response.headers);
        }

        promiseResponse = {
        data: data,
        status: statusCode,
        headers: headers
        };

        promiseResponse[response.responseObjectType] = response.responseObject;

        resolver.resolve(promiseResponse);
      }

  };

  var rewriteRequestToPostIfUrlLengthIsTooLarge = function(options, params) {
    var AUTOMATIC_HTTP_METHOD_OVERRIDE = corbel.Config.AUTOMATIC_HTTP_METHOD_OVERRIDE || true;
    var HTTP_METHOD_OVERRIDE_WITH_URL_SIZE_BIGGER_THAN = corbel.Config.HTTP_METHOD_OVERRIDE_WITH_URL_SIZE_BIGGER_THAN || 2048;

    if (AUTOMATIC_HTTP_METHOD_OVERRIDE &&
      params.method === request.method.GET &&
      params.url.length > HTTP_METHOD_OVERRIDE_WITH_URL_SIZE_BIGGER_THAN) {
      var url = params.url.split('?');
      params.method = request.method.POST;
      params.headers['X-HTTP-Method-Override'] = request.method.GET;
      params.url = url[0];
      options.data = encodeUrlToForm(url[1]);
      options.contentType = 'application/x-www-form-urlencoded';
    }
    return params;
  };

  var encodeURLQueryParamsIfContainsInvalidChars = function(url) {
    var urlComponents = url.split(/\?{1}/g);
    if (urlComponents) {
      return url
        .replace(urlComponents[1],
          encodeURIComponent(urlComponents[1]));
    }

    return url;
  };

  var encodeUrlToForm = function(url) {
    var form = {};
    url.split('&').forEach(function(formEntry) {
      var formPair = formEntry.split('=');
      //value require double encode in Override Method Filter
      form[formPair[0]] = encodeURI(formPair[1]);
    });
    return form;
  };

  request._nodeAjax = function(params, resolver) {
    var requestAjax = require('request');
    if (request.isCrossDomain(params.url) && params.withCredentials) {
      requestAjax = requestAjax.defaults({
        jar: true
      });
    }
    requestAjax({
      method: params.method,
      url: params.url,
      headers: params.headers,
      body: params.data || ''
    }, function(error, response, body) {
      var responseType;
      var status;

      if (error) {
        responseType = undefined;
        status = 0;
      } else {
        responseType = response.responseType || response.headers['content-type'];
        status = response.statusCode;
      }

      processResponse.call(this, {
        responseObject: response,
        dataType: params.dataType,
        responseType: responseType,
        response: body,
        status: status,
        headers: response ? response.headers : {},
        responseObjectType: 'response',
        error: error
      }, resolver, params.callbackSuccess, params.callbackError);

    }.bind(this));

  };

  /**
   * Check if an url should be process as a crossdomain resource.
   * @param {string} url
   * @return {Boolean}
   */
  request.isCrossDomain = function(url) {
    if (url && typeof(url) === 'string' && url.indexOf('http') !== -1) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * https://gist.github.com/monsur/706839
   * @param  {string} headerStr Headers in string format as returned in xhr.getAllResponseHeaders()
   * @return {Object}
   */
  request._parseResponseHeaders = function(headerStr) {
    var headers = {};
    if (!headerStr) {
      return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      // Can't use split() here because it does the wrong thing
      // if the header value has the string ": " in it.
      var index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers[key] = val;
      }
    }
    return headers;
  };

  request._browserAjax = function(params, resolver) {
    var httpReq = new XMLHttpRequest();

    httpReq.open(params.method, params.url, true);

    if (request.isCrossDomain(params.url) && params.withCredentials) {
      httpReq.withCredentials = true;
    }

    /* add request headers */
    for (var header in params.headers) {
      if (params.headers.hasOwnProperty(header)) {
        httpReq.setRequestHeader(header, params.headers[header]);
      }
    }

    // 'blob' support
    httpReq.responseType = params.responseType || httpReq.responseType;

    httpReq.onload = function(xhr) {
      xhr = xhr.target || xhr; // only for mock testing purpose

      processResponse.call(this, {
        responseObject: xhr,
        dataType: xhr.dataType,
        responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
        response: xhr.response || xhr.responseText,
        status: xhr.status,
        headers: request._parseResponseHeaders(xhr.getAllResponseHeaders()),
        responseObjectType: 'xhr',
        error: xhr.error
      }, resolver, params.callbackSuccess, params.callbackError);

      //delete callbacks
    }.bind(this);

    //response fail ()
    httpReq.onerror = function(xhr) {
      xhr = xhr.target || xhr; // only for fake sinon response xhr

      var error;

      // Error flag to support disconnection errors
      if (xhr.type === 'error') {
          error = true;
      }

      processResponse.call(this, {
        responseObject: xhr,
        dataType: xhr.dataType,
        responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
        response: xhr.response || xhr.responseText,
        status: xhr.status,
        responseObjectType: 'xhr',
        error: xhr.error || error
      }, resolver, params.callbackSuccess, params.callbackError);

    }.bind(this);

    httpReq.send(params.data);
  };

  return request;

})();
