(function(root, factory) {
    'use strict';
    /* globals module, define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory(root);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(root);
    } else if (window !== undefined) {
        root.corbel = factory(root);
    }

})(this, function(root) {
    'use strict';
    /* jshint unused: false */

    /*!
     * @overview es6-promise - a tiny implementation of Promises/A+.
     * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
     * @license   Licensed under MIT license
     *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
     * @version   2.0.0
     */
    
    (function() {
        "use strict";
    
        function $$utils$$objectOrFunction(x) {
          return typeof x === 'function' || (typeof x === 'object' && x !== null);
        }
    
        function $$utils$$isFunction(x) {
          return typeof x === 'function';
        }
    
        function $$utils$$isMaybeThenable(x) {
          return typeof x === 'object' && x !== null;
        }
    
        var $$utils$$_isArray;
    
        if (!Array.isArray) {
          $$utils$$_isArray = function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
          };
        } else {
          $$utils$$_isArray = Array.isArray;
        }
    
        var $$utils$$isArray = $$utils$$_isArray;
        var $$utils$$now = Date.now || function() { return new Date().getTime(); };
        function $$utils$$F() { }
    
        var $$utils$$o_create = (Object.create || function (o) {
          if (arguments.length > 1) {
            throw new Error('Second argument not supported');
          }
          if (typeof o !== 'object') {
            throw new TypeError('Argument must be an object');
          }
          $$utils$$F.prototype = o;
          return new $$utils$$F();
        });
    
        var $$asap$$len = 0;
    
        var $$asap$$default = function asap(callback, arg) {
          $$asap$$queue[$$asap$$len] = callback;
          $$asap$$queue[$$asap$$len + 1] = arg;
          $$asap$$len += 2;
          if ($$asap$$len === 2) {
            // If len is 1, that means that we need to schedule an async flush.
            // If additional callbacks are queued before the queue is flushed, they
            // will be processed by this flush that we are scheduling.
            $$asap$$scheduleFlush();
          }
        };
    
        var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
        var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;
    
        // test for web worker but not in IE10
        var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
          typeof importScripts !== 'undefined' &&
          typeof MessageChannel !== 'undefined';
    
        // node
        function $$asap$$useNextTick() {
          return function() {
            process.nextTick($$asap$$flush);
          };
        }
    
        function $$asap$$useMutationObserver() {
          var iterations = 0;
          var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
          var node = document.createTextNode('');
          observer.observe(node, { characterData: true });
    
          return function() {
            node.data = (iterations = ++iterations % 2);
          };
        }
    
        // web worker
        function $$asap$$useMessageChannel() {
          var channel = new MessageChannel();
          channel.port1.onmessage = $$asap$$flush;
          return function () {
            channel.port2.postMessage(0);
          };
        }
    
        function $$asap$$useSetTimeout() {
          return function() {
            setTimeout($$asap$$flush, 1);
          };
        }
    
        var $$asap$$queue = new Array(1000);
    
        function $$asap$$flush() {
          for (var i = 0; i < $$asap$$len; i+=2) {
            var callback = $$asap$$queue[i];
            var arg = $$asap$$queue[i+1];
    
            callback(arg);
    
            $$asap$$queue[i] = undefined;
            $$asap$$queue[i+1] = undefined;
          }
    
          $$asap$$len = 0;
        }
    
        var $$asap$$scheduleFlush;
    
        // Decide what async method to use to triggering processing of queued callbacks:
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
          $$asap$$scheduleFlush = $$asap$$useNextTick();
        } else if ($$asap$$BrowserMutationObserver) {
          $$asap$$scheduleFlush = $$asap$$useMutationObserver();
        } else if ($$asap$$isWorker) {
          $$asap$$scheduleFlush = $$asap$$useMessageChannel();
        } else {
          $$asap$$scheduleFlush = $$asap$$useSetTimeout();
        }
    
        function $$$internal$$noop() {}
        var $$$internal$$PENDING   = void 0;
        var $$$internal$$FULFILLED = 1;
        var $$$internal$$REJECTED  = 2;
        var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();
    
        function $$$internal$$selfFullfillment() {
          return new TypeError("You cannot resolve a promise with itself");
        }
    
        function $$$internal$$cannotReturnOwn() {
          return new TypeError('A promises callback cannot return that same promise.')
        }
    
        function $$$internal$$getThen(promise) {
          try {
            return promise.then;
          } catch(error) {
            $$$internal$$GET_THEN_ERROR.error = error;
            return $$$internal$$GET_THEN_ERROR;
          }
        }
    
        function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
          try {
            then.call(value, fulfillmentHandler, rejectionHandler);
          } catch(e) {
            return e;
          }
        }
    
        function $$$internal$$handleForeignThenable(promise, thenable, then) {
           $$asap$$default(function(promise) {
            var sealed = false;
            var error = $$$internal$$tryThen(then, thenable, function(value) {
              if (sealed) { return; }
              sealed = true;
              if (thenable !== value) {
                $$$internal$$resolve(promise, value);
              } else {
                $$$internal$$fulfill(promise, value);
              }
            }, function(reason) {
              if (sealed) { return; }
              sealed = true;
    
              $$$internal$$reject(promise, reason);
            }, 'Settle: ' + (promise._label || ' unknown promise'));
    
            if (!sealed && error) {
              sealed = true;
              $$$internal$$reject(promise, error);
            }
          }, promise);
        }
    
        function $$$internal$$handleOwnThenable(promise, thenable) {
          if (thenable._state === $$$internal$$FULFILLED) {
            $$$internal$$fulfill(promise, thenable._result);
          } else if (promise._state === $$$internal$$REJECTED) {
            $$$internal$$reject(promise, thenable._result);
          } else {
            $$$internal$$subscribe(thenable, undefined, function(value) {
              $$$internal$$resolve(promise, value);
            }, function(reason) {
              $$$internal$$reject(promise, reason);
            });
          }
        }
    
        function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
          if (maybeThenable.constructor === promise.constructor) {
            $$$internal$$handleOwnThenable(promise, maybeThenable);
          } else {
            var then = $$$internal$$getThen(maybeThenable);
    
            if (then === $$$internal$$GET_THEN_ERROR) {
              $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
            } else if (then === undefined) {
              $$$internal$$fulfill(promise, maybeThenable);
            } else if ($$utils$$isFunction(then)) {
              $$$internal$$handleForeignThenable(promise, maybeThenable, then);
            } else {
              $$$internal$$fulfill(promise, maybeThenable);
            }
          }
        }
    
        function $$$internal$$resolve(promise, value) {
          if (promise === value) {
            $$$internal$$reject(promise, $$$internal$$selfFullfillment());
          } else if ($$utils$$objectOrFunction(value)) {
            $$$internal$$handleMaybeThenable(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }
    
        function $$$internal$$publishRejection(promise) {
          if (promise._onerror) {
            promise._onerror(promise._result);
          }
    
          $$$internal$$publish(promise);
        }
    
        function $$$internal$$fulfill(promise, value) {
          if (promise._state !== $$$internal$$PENDING) { return; }
    
          promise._result = value;
          promise._state = $$$internal$$FULFILLED;
    
          if (promise._subscribers.length === 0) {
          } else {
            $$asap$$default($$$internal$$publish, promise);
          }
        }
    
        function $$$internal$$reject(promise, reason) {
          if (promise._state !== $$$internal$$PENDING) { return; }
          promise._state = $$$internal$$REJECTED;
          promise._result = reason;
    
          $$asap$$default($$$internal$$publishRejection, promise);
        }
    
        function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
          var subscribers = parent._subscribers;
          var length = subscribers.length;
    
          parent._onerror = null;
    
          subscribers[length] = child;
          subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
          subscribers[length + $$$internal$$REJECTED]  = onRejection;
    
          if (length === 0 && parent._state) {
            $$asap$$default($$$internal$$publish, parent);
          }
        }
    
        function $$$internal$$publish(promise) {
          var subscribers = promise._subscribers;
          var settled = promise._state;
    
          if (subscribers.length === 0) { return; }
    
          var child, callback, detail = promise._result;
    
          for (var i = 0; i < subscribers.length; i += 3) {
            child = subscribers[i];
            callback = subscribers[i + settled];
    
            if (child) {
              $$$internal$$invokeCallback(settled, child, callback, detail);
            } else {
              callback(detail);
            }
          }
    
          promise._subscribers.length = 0;
        }
    
        function $$$internal$$ErrorObject() {
          this.error = null;
        }
    
        var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();
    
        function $$$internal$$tryCatch(callback, detail) {
          try {
            return callback(detail);
          } catch(e) {
            $$$internal$$TRY_CATCH_ERROR.error = e;
            return $$$internal$$TRY_CATCH_ERROR;
          }
        }
    
        function $$$internal$$invokeCallback(settled, promise, callback, detail) {
          var hasCallback = $$utils$$isFunction(callback),
              value, error, succeeded, failed;
    
          if (hasCallback) {
            value = $$$internal$$tryCatch(callback, detail);
    
            if (value === $$$internal$$TRY_CATCH_ERROR) {
              failed = true;
              error = value.error;
              value = null;
            } else {
              succeeded = true;
            }
    
            if (promise === value) {
              $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
              return;
            }
    
          } else {
            value = detail;
            succeeded = true;
          }
    
          if (promise._state !== $$$internal$$PENDING) {
            // noop
          } else if (hasCallback && succeeded) {
            $$$internal$$resolve(promise, value);
          } else if (failed) {
            $$$internal$$reject(promise, error);
          } else if (settled === $$$internal$$FULFILLED) {
            $$$internal$$fulfill(promise, value);
          } else if (settled === $$$internal$$REJECTED) {
            $$$internal$$reject(promise, value);
          }
        }
    
        function $$$internal$$initializePromise(promise, resolver) {
          try {
            resolver(function resolvePromise(value){
              $$$internal$$resolve(promise, value);
            }, function rejectPromise(reason) {
              $$$internal$$reject(promise, reason);
            });
          } catch(e) {
            $$$internal$$reject(promise, e);
          }
        }
    
        function $$$enumerator$$makeSettledResult(state, position, value) {
          if (state === $$$internal$$FULFILLED) {
            return {
              state: 'fulfilled',
              value: value
            };
          } else {
            return {
              state: 'rejected',
              reason: value
            };
          }
        }
    
        function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
          this._instanceConstructor = Constructor;
          this.promise = new Constructor($$$internal$$noop, label);
          this._abortOnReject = abortOnReject;
    
          if (this._validateInput(input)) {
            this._input     = input;
            this.length     = input.length;
            this._remaining = input.length;
    
            this._init();
    
            if (this.length === 0) {
              $$$internal$$fulfill(this.promise, this._result);
            } else {
              this.length = this.length || 0;
              this._enumerate();
              if (this._remaining === 0) {
                $$$internal$$fulfill(this.promise, this._result);
              }
            }
          } else {
            $$$internal$$reject(this.promise, this._validationError());
          }
        }
    
        $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
          return $$utils$$isArray(input);
        };
    
        $$$enumerator$$Enumerator.prototype._validationError = function() {
          return new Error('Array Methods must be provided an Array');
        };
    
        $$$enumerator$$Enumerator.prototype._init = function() {
          this._result = new Array(this.length);
        };
    
        var $$$enumerator$$default = $$$enumerator$$Enumerator;
    
        $$$enumerator$$Enumerator.prototype._enumerate = function() {
          var length  = this.length;
          var promise = this.promise;
          var input   = this._input;
    
          for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
            this._eachEntry(input[i], i);
          }
        };
    
        $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
          var c = this._instanceConstructor;
          if ($$utils$$isMaybeThenable(entry)) {
            if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
              entry._onerror = null;
              this._settledAt(entry._state, i, entry._result);
            } else {
              this._willSettleAt(c.resolve(entry), i);
            }
          } else {
            this._remaining--;
            this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
          }
        };
    
        $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
          var promise = this.promise;
    
          if (promise._state === $$$internal$$PENDING) {
            this._remaining--;
    
            if (this._abortOnReject && state === $$$internal$$REJECTED) {
              $$$internal$$reject(promise, value);
            } else {
              this._result[i] = this._makeResult(state, i, value);
            }
          }
    
          if (this._remaining === 0) {
            $$$internal$$fulfill(promise, this._result);
          }
        };
    
        $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
          return value;
        };
    
        $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
          var enumerator = this;
    
          $$$internal$$subscribe(promise, undefined, function(value) {
            enumerator._settledAt($$$internal$$FULFILLED, i, value);
          }, function(reason) {
            enumerator._settledAt($$$internal$$REJECTED, i, reason);
          });
        };
    
        var $$promise$all$$default = function all(entries, label) {
          return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
        };
    
        var $$promise$race$$default = function race(entries, label) {
          /*jshint validthis:true */
          var Constructor = this;
    
          var promise = new Constructor($$$internal$$noop, label);
    
          if (!$$utils$$isArray(entries)) {
            $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
            return promise;
          }
    
          var length = entries.length;
    
          function onFulfillment(value) {
            $$$internal$$resolve(promise, value);
          }
    
          function onRejection(reason) {
            $$$internal$$reject(promise, reason);
          }
    
          for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
            $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
          }
    
          return promise;
        };
    
        var $$promise$resolve$$default = function resolve(object, label) {
          /*jshint validthis:true */
          var Constructor = this;
    
          if (object && typeof object === 'object' && object.constructor === Constructor) {
            return object;
          }
    
          var promise = new Constructor($$$internal$$noop, label);
          $$$internal$$resolve(promise, object);
          return promise;
        };
    
        var $$promise$reject$$default = function reject(reason, label) {
          /*jshint validthis:true */
          var Constructor = this;
          var promise = new Constructor($$$internal$$noop, label);
          $$$internal$$reject(promise, reason);
          return promise;
        };
    
        var $$es6$promise$promise$$counter = 0;
    
        function $$es6$promise$promise$$needsResolver() {
          throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        }
    
        function $$es6$promise$promise$$needsNew() {
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }
    
        var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;
    
        /**
          Promise objects represent the eventual result of an asynchronous operation. The
          primary way of interacting with a promise is through its `then` method, which
          registers callbacks to receive either a promise’s eventual value or the reason
          why the promise cannot be fulfilled.
    
          Terminology
          -----------
    
          - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
          - `thenable` is an object or function that defines a `then` method.
          - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
          - `exception` is a value that is thrown using the throw statement.
          - `reason` is a value that indicates why a promise was rejected.
          - `settled` the final resting state of a promise, fulfilled or rejected.
    
          A promise can be in one of three states: pending, fulfilled, or rejected.
    
          Promises that are fulfilled have a fulfillment value and are in the fulfilled
          state.  Promises that are rejected have a rejection reason and are in the
          rejected state.  A fulfillment value is never a thenable.
    
          Promises can also be said to *resolve* a value.  If this value is also a
          promise, then the original promise's settled state will match the value's
          settled state.  So a promise that *resolves* a promise that rejects will
          itself reject, and a promise that *resolves* a promise that fulfills will
          itself fulfill.
    
    
          Basic Usage:
          ------------
    
          ```js
          var promise = new Promise(function(resolve, reject) {
            // on success
            resolve(value);
    
            // on failure
            reject(reason);
          });
    
          promise.then(function(value) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
    
          Advanced Usage:
          ---------------
    
          Promises shine when abstracting away asynchronous interactions such as
          `XMLHttpRequest`s.
    
          ```js
          function getJSON(url) {
            return new Promise(function(resolve, reject){
              var xhr = new XMLHttpRequest();
    
              xhr.open('GET', url);
              xhr.onreadystatechange = handler;
              xhr.responseType = 'json';
              xhr.setRequestHeader('Accept', 'application/json');
              xhr.send();
    
              function handler() {
                if (this.readyState === this.DONE) {
                  if (this.status === 200) {
                    resolve(this.response);
                  } else {
                    reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
                  }
                }
              };
            });
          }
    
          getJSON('/posts.json').then(function(json) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
    
          Unlike callbacks, promises are great composable primitives.
    
          ```js
          Promise.all([
            getJSON('/posts'),
            getJSON('/comments')
          ]).then(function(values){
            values[0] // => postsJSON
            values[1] // => commentsJSON
    
            return values;
          });
          ```
    
          @class Promise
          @param {function} resolver
          Useful for tooling.
          @constructor
        */
        function $$es6$promise$promise$$Promise(resolver) {
          this._id = $$es6$promise$promise$$counter++;
          this._state = undefined;
          this._result = undefined;
          this._subscribers = [];
    
          if ($$$internal$$noop !== resolver) {
            if (!$$utils$$isFunction(resolver)) {
              $$es6$promise$promise$$needsResolver();
            }
    
            if (!(this instanceof $$es6$promise$promise$$Promise)) {
              $$es6$promise$promise$$needsNew();
            }
    
            $$$internal$$initializePromise(this, resolver);
          }
        }
    
        $$es6$promise$promise$$Promise.all = $$promise$all$$default;
        $$es6$promise$promise$$Promise.race = $$promise$race$$default;
        $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
        $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;
    
        $$es6$promise$promise$$Promise.prototype = {
          constructor: $$es6$promise$promise$$Promise,
    
        /**
          The primary way of interacting with a promise is through its `then` method,
          which registers callbacks to receive either a promise's eventual value or the
          reason why the promise cannot be fulfilled.
    
          ```js
          findUser().then(function(user){
            // user is available
          }, function(reason){
            // user is unavailable, and you are given the reason why
          });
          ```
    
          Chaining
          --------
    
          The return value of `then` is itself a promise.  This second, 'downstream'
          promise is resolved with the return value of the first promise's fulfillment
          or rejection handler, or rejected if the handler throws an exception.
    
          ```js
          findUser().then(function (user) {
            return user.name;
          }, function (reason) {
            return 'default name';
          }).then(function (userName) {
            // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
            // will be `'default name'`
          });
    
          findUser().then(function (user) {
            throw new Error('Found user, but still unhappy');
          }, function (reason) {
            throw new Error('`findUser` rejected and we're unhappy');
          }).then(function (value) {
            // never reached
          }, function (reason) {
            // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
            // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
          });
          ```
          If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
          ```js
          findUser().then(function (user) {
            throw new PedagogicalException('Upstream error');
          }).then(function (value) {
            // never reached
          }).then(function (value) {
            // never reached
          }, function (reason) {
            // The `PedgagocialException` is propagated all the way down to here
          });
          ```
    
          Assimilation
          ------------
    
          Sometimes the value you want to propagate to a downstream promise can only be
          retrieved asynchronously. This can be achieved by returning a promise in the
          fulfillment or rejection handler. The downstream promise will then be pending
          until the returned promise is settled. This is called *assimilation*.
    
          ```js
          findUser().then(function (user) {
            return findCommentsByAuthor(user);
          }).then(function (comments) {
            // The user's comments are now available
          });
          ```
    
          If the assimliated promise rejects, then the downstream promise will also reject.
    
          ```js
          findUser().then(function (user) {
            return findCommentsByAuthor(user);
          }).then(function (comments) {
            // If `findCommentsByAuthor` fulfills, we'll have the value here
          }, function (reason) {
            // If `findCommentsByAuthor` rejects, we'll have the reason here
          });
          ```
    
          Simple Example
          --------------
    
          Synchronous Example
    
          ```javascript
          var result;
    
          try {
            result = findResult();
            // success
          } catch(reason) {
            // failure
          }
          ```
    
          Errback Example
    
          ```js
          findResult(function(result, err){
            if (err) {
              // failure
            } else {
              // success
            }
          });
          ```
    
          Promise Example;
    
          ```javascript
          findResult().then(function(result){
            // success
          }, function(reason){
            // failure
          });
          ```
    
          Advanced Example
          --------------
    
          Synchronous Example
    
          ```javascript
          var author, books;
    
          try {
            author = findAuthor();
            books  = findBooksByAuthor(author);
            // success
          } catch(reason) {
            // failure
          }
          ```
    
          Errback Example
    
          ```js
    
          function foundBooks(books) {
    
          }
    
          function failure(reason) {
    
          }
    
          findAuthor(function(author, err){
            if (err) {
              failure(err);
              // failure
            } else {
              try {
                findBoooksByAuthor(author, function(books, err) {
                  if (err) {
                    failure(err);
                  } else {
                    try {
                      foundBooks(books);
                    } catch(reason) {
                      failure(reason);
                    }
                  }
                });
              } catch(error) {
                failure(err);
              }
              // success
            }
          });
          ```
    
          Promise Example;
    
          ```javascript
          findAuthor().
            then(findBooksByAuthor).
            then(function(books){
              // found books
          }).catch(function(reason){
            // something went wrong
          });
          ```
    
          @method then
          @param {Function} onFulfilled
          @param {Function} onRejected
          Useful for tooling.
          @return {Promise}
        */
          then: function(onFulfillment, onRejection) {
            var parent = this;
            var state = parent._state;
    
            if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
              return this;
            }
    
            var child = new this.constructor($$$internal$$noop);
            var result = parent._result;
    
            if (state) {
              var callback = arguments[state - 1];
              $$asap$$default(function(){
                $$$internal$$invokeCallback(state, child, callback, result);
              });
            } else {
              $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
            }
    
            return child;
          },
    
        /**
          `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
          as the catch block of a try/catch statement.
    
          ```js
          function findAuthor(){
            throw new Error('couldn't find that author');
          }
    
          // synchronous
          try {
            findAuthor();
          } catch(reason) {
            // something went wrong
          }
    
          // async with promises
          findAuthor().catch(function(reason){
            // something went wrong
          });
          ```
    
          @method catch
          @param {Function} onRejection
          Useful for tooling.
          @return {Promise}
        */
          'catch': function(onRejection) {
            return this.then(null, onRejection);
          }
        };
    
        var $$es6$promise$polyfill$$default = function polyfill() {
          var local;
    
          if (typeof global !== 'undefined') {
            local = global;
          } else if (typeof window !== 'undefined' && window.document) {
            local = window;
          } else {
            local = self;
          }
    
          var es6PromiseSupport =
            "Promise" in local &&
            // Some of these methods are missing from
            // Firefox/Chrome experimental implementations
            "resolve" in local.Promise &&
            "reject" in local.Promise &&
            "all" in local.Promise &&
            "race" in local.Promise &&
            // Older version of the spec had a resolver object
            // as the arg rather than a function
            (function() {
              var resolve;
              new local.Promise(function(r) { resolve = r; });
              return $$utils$$isFunction(resolve);
            }());
    
          if (!es6PromiseSupport) {
            local.Promise = $$es6$promise$promise$$default;
          }
        };
    
        var es6$promise$umd$$ES6Promise = {
          'Promise': $$es6$promise$promise$$default,
          'polyfill': $$es6$promise$polyfill$$default
        };
    
        /* global define:true module:true window: true */
        if (typeof define === 'function' && define['amd']) {
          define(function() { return es6$promise$umd$$ES6Promise; });
        } else if (typeof module !== 'undefined' && module['exports']) {
          module['exports'] = es6$promise$umd$$ES6Promise;
        } else if (typeof this !== 'undefined') {
          this['ES6Promise'] = es6$promise$umd$$ES6Promise;
        }
    }).call(this);

    var corbel = {};

    //-----------Utils and libraries (exports into corbel namespace)---------------------------

    (function() {
    
        function CorbelDriver(config) {
        	// create isntance config
            this.config = corbel.Config.create(config);
    
            // create isntance modules with injected driver
            this.iam = corbel.Iam.create(this);
        }
    
        corbel.CorbelDriver = CorbelDriver;
    
        corbel.getDriver = function(config) {
            config = config || {};
    
            var keys = [
                'urlBase',
                'clientId',
                'clientSecret',
                'scopesApp',
                'scopesUserLogin',
                'scopesUserCreate',
                'resourcesEndpoint',
                'iamEndpoint',
                'evciEndpoint',
                'oauthEndpoint',
                'oauthClientId',
                'oauthSecret',
                'oauthService'
            ];
    
            keys.forEach(function(key) {
            	if (!config[key]) {
            		throw new Error('undefined:' + key);
            	}
            });
    
            return new CorbelDriver(config);
        };
    
    
    })();
    
    (function() {
    
        /**
         * A module to some library corbel.utils.
         * @exports validate
         * @namespace
         * @memberof app
         */
        corbel.utils = {};
    
        /**
         * Extend a given object with all the properties in passed-in object(s).
         * @param  {Object}  obj
         * @return {Object}
         */
        corbel.utils.extend = function(obj) {
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
        corbel.utils.param = function(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        };
    
        corbel.utils.reload = function() {
            // console.log('corbel.utils.reload');
            if (window) {
                window.location.reload();
            }
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
        corbel.utils.serializeParams = function(params) {
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
    
    })();
    
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
    
    (function() {
    
        /* jshint camelcase:false */
        corbel.cryptography = (function() {
            /*
             * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
             * in FIPS 180-2
             * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
             * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
             * Distributed under the BSD License
             * See http://pajhome.org.uk/crypt/md5 for details.
             * Also http://anmar.eu.org/projects/jssha2/
             */
    
            /*
             * Configurable variables. You may need to tweak these to be compatible with
             * the server-side, but the defaults work in most cases.
             */
            var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
            var b64pad = ''; /* base-64 pad character. "=" for strict RFC compliance   */
    
            /*
             * These are the functions you'll usually want to call
             * They take string arguments and return either hex or base-64 encoded strings
             */
            function hex_sha256(s) {
                return rstr2hex(rstr_sha256(str2rstr_utf8(s)));
            }
    
            function b64_sha256(s) {
                return rstr2b64(rstr_sha256(str2rstr_utf8(s)));
            }
    
            function any_sha256(s, e) {
                return rstr2any(rstr_sha256(str2rstr_utf8(s)), e);
            }
    
            function hex_hmac_sha256(k, d) {
                return rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
            }
    
            function b64_hmac_sha256(k, d) {
                return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
            }
    
            function any_hmac_sha256(k, d, e) {
                return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e);
            }
    
            /*
             * Perform a simple self-test to see if the VM is working
             */
            function sha256_vm_test() {
                return hex_sha256('abc').toLowerCase() ===
                    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
            }
    
            /*
             * Calculate the sha256 of a raw string
             */
            function rstr_sha256(s) {
                return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
            }
    
            /*
             * Calculate the HMAC-sha256 of a key and some data (raw strings)
             */
            function rstr_hmac_sha256(key, data) {
                var bkey = rstr2binb(key);
                if (bkey.length > 16) {
                    bkey = binb_sha256(bkey, key.length * 8);
                }
    
                var ipad = Array(16),
                    opad = Array(16);
                for (var i = 0; i < 16; i++) {
                    ipad[i] = bkey[i] ^ 0x36363636;
                    opad[i] = bkey[i] ^ 0x5C5C5C5C;
                }
    
                var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
                return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
            }
    
            /*
             * Convert a raw string to a hex string
             */
            function rstr2hex(input) {
                try {
                    hexcase
                } catch (e) {
                    hexcase = 0;
                }
                var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
                var output = '';
                var x;
                for (var i = 0; i < input.length; i++) {
                    x = input.charCodeAt(i);
                    output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
                }
                return output;
            }
    
            /*
             * Convert a raw string to a base-64 string
             */
            function rstr2b64(input) {
                try {
                    b64pad
                } catch (e) {
                    b64pad = '';
                }
                var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var output = '';
                var len = input.length;
                for (var i = 0; i < len; i += 3) {
                    var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                    for (var j = 0; j < 4; j++) {
                        if (i * 8 + j * 6 > input.length * 8) output += b64pad;
                        else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                    }
                }
                return output;
            }
    
            /*
             * Convert a raw string to an arbitrary string encoding
             */
            function rstr2any(input, encoding) {
                var divisor = encoding.length;
                var remainders = Array();
                var i, q, x, quotient;
    
                /* Convert to an array of 16-bit big-endian values, forming the dividend */
                var dividend = Array(Math.ceil(input.length / 2));
                for (i = 0; i < dividend.length; i++) {
                    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
                }
    
                /*
                 * Repeatedly perform a long division. The binary array forms the dividend,
                 * the length of the encoding is the divisor. Once computed, the quotient
                 * forms the dividend for the next step. We stop when the dividend is zero.
                 * All remainders are stored for later use.
                 */
                while (dividend.length > 0) {
                    quotient = Array();
                    x = 0;
                    for (i = 0; i < dividend.length; i++) {
                        x = (x << 16) + dividend[i];
                        q = Math.floor(x / divisor);
                        x -= q * divisor;
                        if (quotient.length > 0 || q > 0)
                            quotient[quotient.length] = q;
                    }
                    remainders[remainders.length] = x;
                    dividend = quotient;
                }
    
                /* Convert the remainders to the output string */
                var output = '';
                for (i = remainders.length - 1; i >= 0; i--)
                    output += encoding.charAt(remainders[i]);
    
                /* Append leading zero equivalents */
                var full_length = Math.ceil(input.length * 8 /
                    (Math.log(encoding.length) / Math.log(2)))
                for (i = output.length; i < full_length; i++)
                    output = encoding[0] + output;
    
                return output;
            }
    
            /*
             * Encode a string as utf-8.
             * For efficiency, this assumes the input is valid utf-16.
             */
            function str2rstr_utf8(input) {
                var output = '';
                var i = -1;
                var x, y;
    
                while (++i < input.length) {
                    /* Decode utf-16 surrogate pairs */
                    x = input.charCodeAt(i);
                    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                    if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                        i++;
                    }
    
                    /* Encode output as utf-8 */
                    if (x <= 0x7F)
                        output += String.fromCharCode(x);
                    else if (x <= 0x7FF)
                        output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                            0x80 | (x & 0x3F));
                    else if (x <= 0xFFFF)
                        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                            0x80 | ((x >>> 6) & 0x3F),
                            0x80 | (x & 0x3F));
                    else if (x <= 0x1FFFFF)
                        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                            0x80 | ((x >>> 12) & 0x3F),
                            0x80 | ((x >>> 6) & 0x3F),
                            0x80 | (x & 0x3F));
                }
                return output;
            }
    
            /*
             * Encode a string as utf-16
             */
            function str2rstr_utf16le(input) {
                var output = '';
                for (var i = 0; i < input.length; i++)
                    output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
                return output;
            }
    
            function str2rstr_utf16be(input) {
                var output = "";
                for (var i = 0; i < input.length; i++)
                    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                        input.charCodeAt(i) & 0xFF);
                return output;
            }
    
            /*
             * Convert a raw string to an array of big-endian words
             * Characters >255 have their high-byte silently ignored.
             */
            function rstr2binb(input) {
                var output = Array(input.length >> 2);
                for (var i = 0; i < output.length; i++)
                    output[i] = 0;
                for (var i = 0; i < input.length * 8; i += 8)
                    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
                return output;
            }
    
            /*
             * Convert an array of big-endian words to a string
             */
            function binb2rstr(input) {
                var output = '';
                for (var i = 0; i < input.length * 32; i += 8)
                    output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
                return output;
            }
    
            /*
             * Main sha256 function, with its support functions
             */
            function sha256_S(X, n) {
                return (X >>> n) | (X << (32 - n));
            }
    
            function sha256_R(X, n) {
                return (X >>> n);
            }
    
            function sha256_Ch(x, y, z) {
                return ((x & y) ^ ((~x) & z));
            }
    
            function sha256_Maj(x, y, z) {
                return ((x & y) ^ (x & z) ^ (y & z));
            }
    
            function sha256_Sigma0256(x) {
                return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));
            }
    
            function sha256_Sigma1256(x) {
                return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));
            }
    
            function sha256_Gamma0256(x) {
                return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));
            }
    
            function sha256_Gamma1256(x) {
                return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));
            }
    
            function sha256_Sigma0512(x) {
                return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));
            }
    
            function sha256_Sigma1512(x) {
                return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));
            }
    
            function sha256_Gamma0512(x) {
                return (sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7));
            }
    
            function sha256_Gamma1512(x) {
                return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));
            }
    
            var sha256_K = new Array(
                1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
                1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
                264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
                113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
                1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
                430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
                1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998
            );
    
            function binb_sha256(m, l) {
                var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
                    1359893119, -1694144372, 528734635, 1541459225);
                var W = new Array(64);
                var a, b, c, d, e, f, g, h;
                var i, j, T1, T2;
    
                /* append padding */
                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;
    
                for (i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];
    
                    for (j = 0; j < 64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                            sha256_Gamma0256(W[j - 15])), W[j - 16]);
    
                        T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                            sha256_K[j]), W[j]);
                        T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }
    
                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }
    
            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }
    
            /*! base64x-1.1.3 (c) 2012-2014 Kenji Urushima | kjur.github.com/jsjws/license
             */
            /*
             * base64x.js - Base64url and supplementary functions for Tom Wu's base64.js library
             *
             * version: 1.1.3 (2014 May 25)
             *
             * Copyright (c) 2012-2014 Kenji Urushima (kenji.urushima@gmail.com)
             *
             * This software is licensed under the terms of the MIT License.
             * http://kjur.github.com/jsjws/license/
             *
             * The above copyright and license notice shall be
             * included in all copies or substantial portions of the Software.
             *
             * DEPENDS ON:
             *   - base64.js - Tom Wu's Base64 library
             */
    
            /**
             * Base64URL and supplementary functions for Tom Wu's base64.js library.<br/>
             * This class is just provide information about global functions
             * defined in 'base64x.js'. The 'base64x.js' script file provides
             * global functions for converting following data each other.
             * <ul>
             * <li>(ASCII) String</li>
             * <li>UTF8 String including CJK, Latin and other characters</li>
             * <li>byte array</li>
             * <li>hexadecimal encoded String</li>
             * <li>Full URIComponent encoded String (such like "%69%94")</li>
             * <li>Base64 encoded String</li>
             * <li>Base64URL encoded String</li>
             * </ul>
             * All functions in 'base64x.js' are defined in {@link _global_} and not
             * in this class.
             *
             * @class Base64URL and supplementary functions for Tom Wu's base64.js library
             * @author Kenji Urushima
             * @version 1.1 (07 May 2012)
             * @requires base64.js
             * @see <a href="http://kjur.github.com/jsjws/">'jwjws'(JWS JavaScript Library) home page http://kjur.github.com/jsjws/</a>
             * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
             */
            function Base64x() {}
    
            // ==== string / byte array ================================
            /**
             * convert a string to an array of character codes
             * @param {String} s
             * @return {Array of Numbers}
             */
            function stoBA(s) {
                var a = new Array();
                for (var i = 0; i < s.length; i++) {
                    a[i] = s.charCodeAt(i);
                }
                return a;
            }
    
            /**
             * convert an array of character codes to a string
             * @param {Array of Numbers} a array of character codes
             * @return {String} s
             */
            function BAtos(a) {
                var s = "";
                for (var i = 0; i < a.length; i++) {
                    s = s + String.fromCharCode(a[i]);
                }
                return s;
            }
    
            // ==== byte array / hex ================================
            /**
             * convert an array of bytes(Number) to hexadecimal string.<br/>
             * @param {Array of Numbers} a array of bytes
             * @return {String} hexadecimal string
             */
            function BAtohex(a) {
                var s = "";
                for (var i = 0; i < a.length; i++) {
                    var hex1 = a[i].toString(16);
                    if (hex1.length == 1) hex1 = "0" + hex1;
                    s = s + hex1;
                }
                return s;
            }
    
            // ==== string / hex ================================
            /**
             * convert a ASCII string to a hexadecimal string of ASCII codes.<br/>
             * NOTE: This can't be used for non ASCII characters.
             * @param {s} s ASCII string
             * @return {String} hexadecimal string
             */
            function stohex(s) {
                return BAtohex(stoBA(s));
            }
    
            // ==== string / base64 ================================
            /**
             * convert a ASCII string to a Base64 encoded string.<br/>
             * NOTE: This can't be used for non ASCII characters.
             * @param {s} s ASCII string
             * @return {String} Base64 encoded string
             */
            function stob64(s) {
                return hex2b64(stohex(s));
            }
    
            // ==== string / base64url ================================
            /**
             * convert a ASCII string to a Base64URL encoded string.<br/>
             * NOTE: This can't be used for non ASCII characters.
             * @param {s} s ASCII string
             * @return {String} Base64URL encoded string
             */
            function stob64u(s) {
                return b64tob64u(hex2b64(stohex(s)));
            }
    
            /**
             * convert a Base64URL encoded string to a ASCII string.<br/>
             * NOTE: This can't be used for Base64URL encoded non ASCII characters.
             * @param {s} s Base64URL encoded string
             * @return {String} ASCII string
             */
            function b64utos(s) {
                return BAtos(b64toBA(b64utob64(s)));
            }
    
            // ==== base64 / base64url ================================
            /**
             * convert a Base64 encoded string to a Base64URL encoded string.<br/>
             * Example: "ab+c3f/==" &rarr; "ab-c3f_"
             * @param {String} s Base64 encoded string
             * @return {String} Base64URL encoded string
             */
            function b64tob64u(s) {
                s = s.replace(/\=/g, '');
                s = s.replace(/\+/g, '-');
                s = s.replace(/\//g, '_');
                return s;
            }
    
            /**
             * convert a Base64URL encoded string to a Base64 encoded string.<br/>
             * Example: 'ab-c3f_' &rarr; 'ab+c3f/=='
             * @param {String} s Base64URL encoded string
             * @return {String} Base64 encoded string
             */
            function b64utob64(s) {
                if (s.length % 4 == 2) s = s + '==';
                else if (s.length % 4 == 3) s = s + '=';
                s = s.replace(/-/g, '+');
                s = s.replace(/_/g, '/');
                return s;
            }
    
            // ==== hex / base64url ================================
            /**
             * convert a hexadecimal string to a Base64URL encoded string.<br/>
             * @param {String} s hexadecimal string
             * @return {String} Base64URL encoded string
             */
            function hextob64u(s) {
                return b64tob64u(hex2b64(s));
            }
    
            /**
             * convert a Base64URL encoded string to a hexadecimal string.<br/>
             * @param {String} s Base64URL encoded string
             * @return {String} hexadecimal string
             */
            function b64utohex(s) {
                return b64tohex(b64utob64(s));
            }
    
            var utf8tob64u, b64utoutf8;
    
            if (typeof Buffer === 'function') {
                utf8tob64u = function(s) {
                    return b64tob64u(new Buffer(s, 'utf8').toString('base64'));
                };
    
                b64utoutf8 = function(s) {
                    return new Buffer(b64utob64(s), 'base64').toString('utf8');
                };
            } else {
                // ==== utf8 / base64url ================================
                /**
                 * convert a UTF-8 encoded string including CJK or Latin to a Base64URL encoded string.<br/>
                 * @param {String} s UTF-8 encoded string
                 * @return {String} Base64URL encoded string
                 * @since 1.1
                 */
                utf8tob64u = function(s) {
                    return hextob64u(uricmptohex(encodeURIComponentAll(s)));
                };
    
                /**
                 * convert a Base64URL encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
                 * @param {String} s Base64URL encoded string
                 * @return {String} UTF-8 encoded string
                 * @since 1.1
                 */
                b64utoutf8 = function(s) {
                    return decodeURIComponent(hextouricmp(b64utohex(s)));
                };
            }
    
            // ==== utf8 / base64url ================================
            /**
             * convert a UTF-8 encoded string including CJK or Latin to a Base64 encoded string.<br/>
             * @param {String} s UTF-8 encoded string
             * @return {String} Base64 encoded string
             * @since 1.1.1
             */
            function utf8tob64(s) {
                return hex2b64(uricmptohex(encodeURIComponentAll(s)));
            }
    
            /**
             * convert a Base64 encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
             * @param {String} s Base64 encoded string
             * @return {String} UTF-8 encoded string
             * @since 1.1.1
             */
            function b64toutf8(s) {
                return decodeURIComponent(hextouricmp(b64tohex(s)));
            }
    
            // ==== utf8 / hex ================================
            /**
             * convert a UTF-8 encoded string including CJK or Latin to a hexadecimal encoded string.<br/>
             * @param {String} s UTF-8 encoded string
             * @return {String} hexadecimal encoded string
             * @since 1.1.1
             */
            function utf8tohex(s) {
                return uricmptohex(encodeURIComponentAll(s));
            }
    
            /**
             * convert a hexadecimal encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
             * Note that when input is improper hexadecimal string as UTF-8 string, this function returns
             * 'null'.
             * @param {String} s hexadecimal encoded string
             * @return {String} UTF-8 encoded string or null
             * @since 1.1.1
             */
            function hextoutf8(s) {
                return decodeURIComponent(hextouricmp(s));
            }
    
            /**
             * convert a hexadecimal encoded string to raw string including non printable characters.<br/>
             * @param {String} s hexadecimal encoded string
             * @return {String} raw string
             * @since 1.1.2
             * @example
             * hextorstr("610061") &rarr; "a\x00a"
             */
            function hextorstr(sHex) {
                var s = "";
                for (var i = 0; i < sHex.length - 1; i += 2) {
                    s += String.fromCharCode(parseInt(sHex.substr(i, 2), 16));
                }
                return s;
            }
    
            /**
             * convert a raw string including non printable characters to hexadecimal encoded string.<br/>
             * @param {String} s raw string
             * @return {String} hexadecimal encoded string
             * @since 1.1.2
             * @example
             * rstrtohex("a\x00a") &rarr; "610061"
             */
            function rstrtohex(s) {
                var result = '';
                for (var i = 0; i < s.length; i++) {
                    result += ('0' + s.charCodeAt(i).toString(16)).slice(-2);
                }
                return result;
            }
    
            // ==== hex / b64nl =======================================
    
            /*
             * since base64x 1.1.3
             */
            function hextob64(s) {
                return hex2b64(s);
            }
    
            /*
             * since base64x 1.1.3
             */
            function hextob64nl(s) {
                var b64 = hextob64(s);
                var b64nl = b64.replace(/(.{64})/g, '$1\r\n');
                b64nl = b64nl.replace(/\r\n$/, '');
                return b64nl;
            }
    
            /*
             * since base64x 1.1.3
             */
            function b64nltohex(s) {
                var b64 = s.replace(/[^0-9A-Za-z\/+=]*/g, '');
                var hex = b64tohex(b64);
                return hex;
            }
    
            // ==== URIComponent / hex ================================
            /**
             * convert a URLComponent string such like "%67%68" to a hexadecimal string.<br/>
             * @param {String} s URIComponent string such like "%67%68"
             * @return {String} hexadecimal string
             * @since 1.1
             */
            function uricmptohex(s) {
                return s.replace(/%/g, '');
            }
    
            /**
             * convert a hexadecimal string to a URLComponent string such like "%67%68".<br/>
             * @param {String} s hexadecimal string
             * @return {String} URIComponent string such like "%67%68"
             * @since 1.1
             */
            function hextouricmp(s) {
                return s.replace(/(..)/g, '%$1');
            }
    
            // ==== URIComponent ================================
            /**
             * convert UTFa hexadecimal string to a URLComponent string such like "%67%68".<br/>
             * Note that these "<code>0-9A-Za-z!'()*-._~</code>" characters will not
             * converted to "%xx" format by builtin 'encodeURIComponent()' function.
             * However this 'encodeURIComponentAll()' function will convert
             * all of characters into "%xx" format.
             * @param {String} s hexadecimal string
             * @return {String} URIComponent string such like "%67%68"
             * @since 1.1
             */
            function encodeURIComponentAll(u8) {
                var s = encodeURIComponent(u8);
                var s2 = '';
                for (var i = 0; i < s.length; i++) {
                    if (s[i] == '%') {
                        s2 = s2 + s.substr(i, 3);
                        i = i + 2;
                    } else {
                        s2 = s2 + '%' + stohex(s[i]);
                    }
                }
                return s2;
            }
    
            // ==== new lines ================================
            /**
             * convert all DOS new line("\r\n") to UNIX new line("\n") in
             * a String "s".
             * @param {String} s string
             * @return {String} converted string
             */
            function newline_toUnix(s) {
                s = s.replace(/\r\n/mg, '\n');
                return s;
            }
    
            /**
             * convert all UNIX new line('\r\n') to DOS new line('\n') in
             * a String 's'.
             * @param {String} s string
             * @return {String} converted string
             */
            function newline_toDos(s) {
                s = s.replace(/\r\n/mg, '\n');
                s = s.replace(/\n/mg, '\r\n');
                return s;
            }
    
    
            return {
                rstr2b64: rstr2b64,
                str2rstr_utf8: str2rstr_utf8,
                b64_hmac_sha256: b64_hmac_sha256,
                b64tob64u: b64tob64u
            }
        })();
    
    })();
    

    //----------corbel modules----------------

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
    
    (function() {
    
    
    
        /**
         * Request object available for brwoser and node environment
         * @type {Object}
         */
        corbel.request = {};
    
    
        /**
         * Public method to make ajax request
         * @param  {Object} options                                     Object options for ajax request
         * @param  {String} options.url                                 The request url domain
         * @param  {String} options.method                              The method used for the request
         * @param  {Object} options.headers                             The request headers
         * @param  {String} options.contentType                         The content type of the body
         * @param  {Object || Uint8Array || blob} options.data          Optional data sent to the server
         * @param  {Function} options.success                           Callback function for success request response
         * @param  {Function} options.error                             Callback function for handle error in the request
         * @return {ES6 Promise}                                        Promise about the request status and response
         */
        corbel.request.send = function(options) {
            options = options || {};
    
            var params = {
                method: String((options.method || 'GET')).toUpperCase(),
                url: options.url,
                headers: typeof options.headers === 'object' ? options.headers : {},
                contentType: options.contentType || 'application/json',
                get isJSON() {
                    return this.contentType.indexOf('json') !== -1 ? true : false;
                },
                callbackSuccess: options.success && typeof options.success === 'function' ? options.success : undefined,
                callbackError: options.error && typeof options.error === 'function' ? options.error : undefined,
                //responseType: options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                dataType: options.responseType === 'blob' ? options.type || 'image/jpg' : undefined,
                get data() {
                    return (params.method === 'PUT' || params.method === 'POST' || params.method === 'PATCH') ? options.data || {} : undefined;
                }
            };
    
            if (!params.url) {
                throw new Error('undefined:url');
            }
    
    
            // add responseType to the request (blob || arraybuffer || text)
            // httpReq.responseType = responseType;
    
            //add content - type header
            params.headers['content-type'] = params.contentType;
    
            var promise = new Promise(function(resolve, reject) {
    
                var resolver = {
                    resolve: resolve,
                    reject: reject
                };
    
                if (typeof module !== 'undefined' && module.exports) { //nodejs
                    nodeAjax.call(this, params, resolver);
                } else if (typeof window !== 'undefined') { //browser
                    browserAjax.call(this, params, resolver);
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
         * Process the server response data to the specified object/array/blob/byteArray/text
         * @param  {Mixed} data                             The server response
         * @param  {String} type='array'|'blob'|'json'      The class of the server response
         * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
         * @return {Mixed}                                  Processed data
         */
        var processResponseData = function(data, type, dataType) {
            var parsedData = data;
    
            if (type === 'arraybuffer') {
                parsedData = new Uint8Array(data);
            } else if (type === 'blob') {
                parsedData = new Blob([data], {
                    type: dataType
                });
            }
    
            return parsedData;
    
        };
    
        /**
         * Serialize the data to be sent to the server
         * @param  {Mixed} data                             The data that would be sent to the server
         * @param  {String} type='array'|'blob'|'json'      The class of the data (array, blob, json)
         * @return {String}                                 Serialized data
         */
        var serializeData = function(data, type) {
            var serializedData = data;
    
            if (type === 'json' && typeof data === 'object') {
                serializedData = JSON.stringify(data);
            }
    
            return serializedData;
    
        };
    
        /**
         * Process server response
         * @param  {[Response object]} response
         * @param  {[Object]} resolver
         * @param  {[Function]} callbackSuccess
         * @param  {[Function]} callbackError
         */
        var processResponse = function(response, resolver, callbackSuccess, callbackError) {
    
            //xhr = xhr.target || xhr || {};
            var statusCode = xhrSuccessStatus[response.status] || response.status,
                statusType = Number(response.status.toString()[0]),
                promiseResponse;
    
            if (statusType < 3) {
                var data = processResponseData(response.responseType, response.dataType);
    
                if (callbackSuccess) {
                    callbackSuccess.call(this, data, statusCode, response.responseObject);
                }
    
                promiseResponse = {
                    data: data,
                    status: statusCode,
                };
    
                promiseResponse[response.responseObjectType] = response.responseObject;
    
                resolver.resolve(promiseResponse);
    
            } else if (statusType === 4) {
    
                if (callbackError) {
                    callbackError.call(this, response.error, statusCode, response.responseObject);
                }
    
                promiseResponse = {
                    data: response.responseObject,
                    status: statusCode,
                    error: response.error
                };
    
                promiseResponse[response.responseObjectType] = response.responseObject;
    
                resolver.reject(promiseResponse);
            }
    
        };
    
    
        var nodeAjax = function(params, resolver) {
    
            var request = require('request');
    
            request({
                method: params.method,
                url: params.url,
                headers: params.headers,
                json: params.isJSON,
                body: params.data
            }, function(error, response, body) {
    
                processResponse.call(this, {
                    responseObject: response,
                    dataType: params.dataType,
                    responseType: response.headers['content-type'],
                    response: body,
                    status: response.statusCode,
                    responseObjectType: 'response',
                    error: error
                }, resolver, params.callbackSuccess, params.callbackError);
    
            }.bind(this));
    
        };
    
        var browserAjax = function(params, resolver) {
    
            var httpReq = new XMLHttpRequest();
    
    
            httpReq.open(params.method, params.url, true);
    
            /* add request headers */
            for (var header in params.headers) {
                if (params.headers.hasOwnProperty(header)) {
                    httpReq.setRequestHeader(header, params.headers[header]);
                }
            }
    
            httpReq.onload = function(xhr) {
                xhr = xhr.target || xhr; // only for fake sinon response xhr
    
                processResponse.call(this, {
                    responseObject: xhr,
                    dataType: xhr.dataType,
                    responseType: xhr.responseType,
                    response: xhr.response || xhr.responseText,
                    status: xhr.status,
                    responseObjectType: 'xhr',
                    error: xhr.error
                }, resolver, params.callbackSuccess, params.callbackError);
    
                //delete callbacks
            }.bind(this);
    
            //response fail ()
            httpReq.onerror = function(xhr) {
                xhr = xhr.target || xhr; // only for fake sinon response xhr
    
                processResponse.call(this, {
                    responseObject: xhr,
                    dataType: xhr.dataType,
                    responseType: xhr.responseType,
                    response: xhr.response || xhr.responseText,
                    status: xhr.status,
                    responseObjectType: 'xhr',
                    error: xhr.error
                }, resolver, params.callbackSuccess, params.callbackError);
    
            }.bind(this);
    
            if (params.data) {
                httpReq.send(serializeData(params.data, params.responseType));
            } else {
                httpReq.send();
            }
    
        };
    
        return corbel.request;
    
    })();
    
    /* jshint camelcase:false */
    (function() {
    
        corbel.jwt = {
    
            EXPIRATION: 3500,
            ALGORITHM: 'HS256',
            VERSION: '1.0.0',
    
            /**
             * JWT-HmacSHA256 generator
             * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
             * @param  {Object}                                 claims Specific claims to include in the JWT (iss, aud, exp, scope, ...)
             * @param  {String} secret                          String with the client assigned secret
             * @param  {Object} [alg='corbel.jwt.ALGORITHM']    Object with the algorithm type
             * @return {String} jwt                             JWT string
             */
            generate: function(claims, secret, alg) {
                alg = alg || corbel.jwt.ALGORITHM;
    
                var bAlg = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify({
                        alg: alg
                    }))),
                    bClaims = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify(claims))),
                    segment = bAlg + '.' + bClaims,
                    assertion = corbel.cryptography.b64tob64u(corbel.cryptography.b64_hmac_sha256(secret, segment));
    
                return segment + '.' + assertion;
            },
    
            /**
             * Returns a claim with default values, that can be overriden with params values.
             * @param  {Object} params Dicctionary with claims values
             * @return {Object}        Claims Object
             */
            createClaims: function(params) {
                params = params || {};
    
                // Default claims values
                var claims = {
                    version: params.version || corbel.jwt.VERSION,
                    exp: params.exp || Math.round((new Date().getTime() / 1000)) + corbel.jwt.EXPIRATION
                };
    
                claims = corbel.utils.extend(claims, params);
    
                if (!claims.iss) {
                    throw new Error('jwt:undefined:iss');
                }
                if (!claims.aud) {
                    throw new Error('jwt:undefined:aud');
                }
                if (!claims.scope) {
                    throw new Error('jwt:undefined:scope');
                }
                if (!claims.version) {
                    throw new Error('jwt:undefined:version');
                }
                if (!claims.exp) {
                    throw new Error('jwt:undefined:exp');
                }
    
                return claims;
            }
        };
    
        return corbel.jwt;
    
    })();
    
    (function() {
    
        /** --core engine services-- */
    
        var corbelServices = corbel.services = {
            /**
             * method constants
             * @namespace
             */
            method: {
    
                /**
                 * GET constant
                 * @constant
                 * @type {String}
                 * @default
                 */
                GET: 'GET',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                POST: 'POST',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                PUT: 'PUT',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                DELETE: 'DELETE',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                OPTIONS: 'OPTIONS',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                PATCH: 'PATCH',
                /**
                 * @constant
                 * @type {String}
                 * @default
                 */
                HEAD: 'HEAD'
            }
        };
    
    
        var _FORCE_UPDATE_TEXT = 'unsupported_version',
            _FORCE_UPDATE_MAX_RETRIES = 3;
        // _FORCE_UPDATE_STATUS = 'fu_r';
    
        /**
         * Generic Services request.
         * Support all corbel.request parameters and some more:
         * @param {Object} args
         * @param {String} [args.method=app.services.method.GET]
         * @param {String} [args.accessToken] set request with auth. (accessToken overrides args.withAuth)
         * @param {Boolean} [args.withAuth] set request with auth. (if not exists args.accessToken)
         * @param {Boolean} [args.noRetry] [Disable automatic retry strategy]
         * @param {String} [args.retryHook] [reqres hook to retry refresh token]
         * @return {ES6 Promise}
         */
        corbelServices.request = function(args) {
    
            return new Promise(function(resolve, reject) {
    
    
                corbelServices.makeRequest({
                    resolve: resolve,
                    reject: reject
                }, args);
    
            });
        };
    
    
        /**
         * Check if an url should be process as a crossdomain resource.
         * @return {Boolean}
         */
        corbelServices.isCrossDomain = function(url) {
            if (url && url.indexOf('http') !== -1) {
                return true;
            } else {
                return false;
            }
        };
    
        /**
         * Transform an array of scopes to a string separated by an space
         * @param  {Array} scopes
         * @return {String}
         */
        corbelServices.arrayScopesToString = function(scopes) {
            var memo = '';
    
            scopes.forEach(function(scope) {
                memo += ' ' + scope;
            });
    
            return memo.substr(1);
        };
    
    
        /**
         * Execute the actual ajax request.
         * Retries request with refresh token when credentials are needed.
         * Refreshes the client when a force update is detected.
         * Returns a server error (403 - unsupported_version) when force update max retries are reached
         *
         * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
         * @param  {Object} args    The request arguments.
         */
        corbelServices.makeRequest = function(resolver, args) {
            // console.log('services.doRequestCall.args', args);
    
            var params = corbelServices.buildParams(args);
            corbel.request.send(params).then(function(response) {
    
                // console.log('doRequestCall.resolve', arguments);
    
                // session.add(_FORCE_UPDATE_STATUS, 0); //TODO SESSION
    
                resolver.resolve({
                    data: response.data, //arguments[0]
                    textStatus: response.status, //arguments[1]
                    responseObject: response.response || response.xhr //arguments[2]
                });
    
            }).fail(function(response) {
                // Force update
                if (response.status === 403 &&
                    response.textStatus === _FORCE_UPDATE_TEXT) {
    
                    var retries = /*session.get(_FORCE_UPDATE_STATUS) ||*/ 0; //TODO SESSION
                    if (retries < _FORCE_UPDATE_MAX_RETRIES) {
                        // console.log('services.request.force_update.reload', retries);
                        retries++;
                        // session.add(_FORCE_UPDATE_STATUS, retries); //TODO SESSION
    
                        corbel.utils.reload();
                    } else {
                        // console.log('services.request.force_update.fail');
    
                        // Send an error to the caller
                        resolver.reject({
                            responseObject: response.xhr || response.response, //arguments[0]
                            textStatus: response.status, //arguments[1]
                            errorThrown: response.error //arguments[2]
                        });
    
                    }
                } else {
                    // Any other error fail to the caller
                    resolver.reject({
                        responseObject: response.xhr || response.response, //arguments[0]
                        textStatus: response.status, //arguments[1]
                        errorThrown: response.error //arguments[2]
                    });
                }
    
            });
        };
    
    
        /**
         * Returns a valid corbel.request parameters with default values,
         * CORS detection and authorization params if needed.
         * By default, all request are json (dataType/contentType)
         * with object serialization support
         * @param  {Object} args
         * @return {Object}
         */
        corbelServices.buildParams = function(args) {
    
            // Default values
            args = args || {};
    
            // args.dataType = args.dataType || 'json';
            // args.contentType = args.contentType || 'application/json; charset=utf-8';
            args.dataFilter = args.dataFilter || addEmptyJson;
    
            // Construct url with query string
            var url = args.url;
    
            if (!url) {
                throw new Error('You must define an url');
            }
    
            if (args.query) {
                url += '?' + args.query;
            }
    
            var headers = args.headers || {};
            // Use access access token if exists
            if (args.accessToken) {
                headers.Authorization = 'Bearer ' + args.accessToken;
            }
            if (args.noRedirect) {
                headers['No-Redirect'] = true;
            }
            if (args.Accept) {
                headers.Accept = args.Accept;
                args.dataType = undefined; // Accept & dataType are incompatibles
            }
    
    
            var params = {
                url: url,
                dataType: args.dataType,
                contentType: args.contentType,
                type: args.method || corbelServices.method.GET,
                headers: headers,
                data: (args.contentType.indexOf('json') !== -1 && typeof args.data === 'object' ? JSON.stringify(args.data) : args.data),
                dataFilter: args.dataFilter
            };
    
            // For binary requests like 'blob' or 'arraybuffer', set correct dataType
            params.dataType = args.binaryType || params.dataType;
    
            // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
            // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.type === 'PUT' || params.type === 'POST')) {
            //     params.processData = false;
            // }
    
            // if (corbelServices.isCrossDomain(url)) {
            //     // http://stackoverflow.com/questions/5241088/jquery-call-to-webservice-returns-no-transport-error
            //     $.support.cors = true;
            //     params.crossDomain = true;
            //     if (args.withCredentials) {
            //         params.xhrFields = {
            //             withCredentials: true
            //         };
            //     }
            // }
    
            // console.log('services.buildParams (params)', params);
            // if (args.data) {
            //      console.log('services.buildParams (data)', args.data);
            // }
    
            return params;
        };
    
    
        var addEmptyJson = function(response, type) {
            if (!response && type === 'json') {
                response = '{}';
            }
            return response;
        };
    
    
        /** end--core engine services-- */
    
    
        return corbelServices;
    
    })();
    (function() {
    
        /**
         * A module to make iam requests.
         * @exports iam
         * @namespace
         * @memberof app.corbel
         */
        
        var Iam = corbel.Iam = function(driver) {
            this.driver = driver;
        };
    
        Iam.create = function(driver) {
            return new Iam(driver);
        };
    
        Iam.GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
        Iam.AUD = 'http://iam.bqws.io';
    
        /**
         * COMMON MIXINS
         */
    
        /**
         * Provate method to build a tring uri
         * @private
         * @param  {String} uri
         * @param  {String|Number} id
         * @return {String}
         */
        Iam._buildUri = function(uri, id) {
            if (id) {
                uri += '/' + id;
            }
            return this.driver.config.get('iamEndpoint') + uri;
        };
    
    })();
    

    return corbel;
});