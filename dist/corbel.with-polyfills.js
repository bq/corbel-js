(function(root, factory) {
    'use strict';
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
            $$utils$$_isArray = function(x) {
                return Object.prototype.toString.call(x) === '[object Array]';
            };
        } else {
            $$utils$$_isArray = Array.isArray;
        }

        var $$utils$$isArray = $$utils$$_isArray;
        var $$utils$$now = Date.now || function() {
            return new Date().getTime();
        };

        function $$utils$$F() {}

        var $$utils$$o_create = (Object.create || function(o) {
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
            observer.observe(node, {
                characterData: true
            });

            return function() {
                node.data = (iterations = ++iterations % 2);
            };
        }

        // web worker
        function $$asap$$useMessageChannel() {
            var channel = new MessageChannel();
            channel.port1.onmessage = $$asap$$flush;
            return function() {
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
            for (var i = 0; i < $$asap$$len; i += 2) {
                var callback = $$asap$$queue[i];
                var arg = $$asap$$queue[i + 1];

                callback(arg);

                $$asap$$queue[i] = undefined;
                $$asap$$queue[i + 1] = undefined;
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
        var $$$internal$$PENDING = void 0;
        var $$$internal$$FULFILLED = 1;
        var $$$internal$$REJECTED = 2;
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
            } catch (error) {
                $$$internal$$GET_THEN_ERROR.error = error;
                return $$$internal$$GET_THEN_ERROR;
            }
        }

        function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
            try {
                then.call(value, fulfillmentHandler, rejectionHandler);
            } catch (e) {
                return e;
            }
        }

        function $$$internal$$handleForeignThenable(promise, thenable, then) {
            $$asap$$default(function(promise) {
                var sealed = false;
                var error = $$$internal$$tryThen(then, thenable, function(value) {
                    if (sealed) {
                        return;
                    }
                    sealed = true;
                    if (thenable !== value) {
                        $$$internal$$resolve(promise, value);
                    } else {
                        $$$internal$$fulfill(promise, value);
                    }
                }, function(reason) {
                    if (sealed) {
                        return;
                    }
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
            if (promise._state !== $$$internal$$PENDING) {
                return;
            }

            promise._result = value;
            promise._state = $$$internal$$FULFILLED;

            if (promise._subscribers.length === 0) {} else {
                $$asap$$default($$$internal$$publish, promise);
            }
        }

        function $$$internal$$reject(promise, reason) {
            if (promise._state !== $$$internal$$PENDING) {
                return;
            }
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
            subscribers[length + $$$internal$$REJECTED] = onRejection;

            if (length === 0 && parent._state) {
                $$asap$$default($$$internal$$publish, parent);
            }
        }

        function $$$internal$$publish(promise) {
            var subscribers = promise._subscribers;
            var settled = promise._state;

            if (subscribers.length === 0) {
                return;
            }

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
            } catch (e) {
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
                resolver(function resolvePromise(value) {
                    $$$internal$$resolve(promise, value);
                }, function rejectPromise(reason) {
                    $$$internal$$reject(promise, reason);
                });
            } catch (e) {
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
                this._input = input;
                this.length = input.length;
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
            var length = this.length;
            var promise = this.promise;
            var input = this._input;

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
            return new $$$enumerator$$default(this, entries, true /* abort on reject */ , label).promise;
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
                    $$asap$$default(function() {
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
                    new local.Promise(function(r) {
                        resolve = r;
                    });
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
            define(function() {
                return es6$promise$umd$$ES6Promise;
            });
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
            // create instance config
            this.guid = corbel.utils.guid();
            this.config = corbel.Config.create(config);

            // create isntance modules with injected driver
            this.iam = corbel.Iam.create(this);
            this.resources = corbel.Resources.create(this);
            this.services = corbel.Services.create(this);
            this.session = corbel.Session.create(this);
        }

        corbel.CorbelDriver = CorbelDriver;

        /**
         * Instanciates new corbel driver
         * @param {Object} config
         * @param {String} config.urlBase
         * @param {String} [config.clientId]
         * @param {String} [config.clientSecret]
         * @param {String} [config.scopes]
         * @return {CorbelDriver}
         */
        corbel.getDriver = function(config) {
            config = config || {};

            if (!config.urlBase) {
                throw new Error('error:undefined:urlbase');
            }

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

            return result;
        };

        return utils;

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
         * Checks if a variable is a type of object
         * @param  {object}  test object
         * @return {Boolean}
         */
        corbel.validate.isObject = function(obj) {
            return typeof obj === 'object';
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


        corbel.Object = function() {
            return this;
        };

        corbel.Object.inherit = corbel.utils.inherit;

        return corbel.Object;

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

            function b64_hmac_sha256(k, d) {
                return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
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

            var utf8tob64u, b64utoutf8;

            return {
                rstr2b64: rstr2b64,
                str2rstr_utf8: str2rstr_utf8,
                b64_hmac_sha256: b64_hmac_sha256,
                b64tob64u: b64tob64u
            }
        })();

    })();


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
                if (typeof localStorage === 'undefined' || localStorage === null && /*corbel.enviroment === 'node'*/ typeof module !== 'undefined' && module.exports) {
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

    //----------corbel modules----------------

    (function() {

        function Config(config) {
            config = config || {};
            // config default values
            this.config = {};

            corbel.utils.extend(this.config, config);
        }

        Config.URL_BASE_PLACEHOLDER = '{{module}}';

        corbel.Config = Config;

        Config.isNode = typeof module !== 'undefined' && module.exports;

        /**
         * Client type
         * @type {String}
         * @default
         */
        Config.clientType = Config.isNode ? 'NODE' : 'WEB';
        Config.wwwRoot = !Config.isNode ? root.location.protocol + '//' + root.location.host + root.location.pathname : 'localhost';

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

        /**
         * Sets a new value for specific config param
         * @param {String} field Config param name
         * @param {Mixed} value Config param value
         */
        Config.prototype.set = function(field, value) {
            this.config[field] = value;
        };

    })();

    (function() {



        /**
         * Request object available for brwoser and node environment
         * @type {Object}
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

        request.serializeHandlers = {
            json: function(data) {
                if (typeof data !== 'string') {
                    return JSON.stringify(data);
                } else {
                    return data;
                }
            },
            'form-urlencoded': function(data) {
                return corbel.utils.toURLEncoded(data);
            }
        };

        request.serialize = function(data, contentType) {
            var serialized;
            Object.keys(request.serializeHandlers).forEach(function(type) {
                if (contentType.indexOf(type) !== -1) {
                    serialized = request.serializeHandlers[type](data);
                }
            });
            return serialized;
        };

        request.parseHandlers = {
            json: function(data) {
                data = data || '{}';
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                return data;
            },
            arraybuffer: function(data) {
                return new Uint8Array(data);
            },
            blob: function(data, dataType) {
                return new Blob([data], {
                    type: dataType
                });
            },
            // @todo: xml
        };

        /**
         * Process the server response data to the specified object/array/blob/byteArray/text
         * @param  {Mixed} data                             The server response
         * @param  {String} type='array'|'blob'|'json'      The class of the server response
         * @param  {Stirng} dataType                        Is an extra param to form the blob object (if the type is blob)
         * @return {Mixed}                                  Processed data
         */
        request.parse = function(data, responseType, dataType) {
            var parsed;
            Object.keys(request.parseHandlers).forEach(function(type) {
                if (responseType.indexOf(type) !== -1) {
                    parsed = request.parseHandlers[type](data, dataType);
                }
            });
            return parsed;
        };

        /**
         * Public method to make ajax request
         * @param  {Object} options                                     Object options for ajax request
         * @param  {String} options.url                                 The request url domain
         * @param  {String} options.method                              The method used for the request
         * @param  {Object} options.headers                             The request headers
         * @param  {String} options.responseType                         The response type of the body
         * @param  {String} options.contentType                         The content type of the body
         * @param  {Object || Uint8Array || blob} options.dataType          Optional data sent to the server
         * @param  {Function} options.success                           Callback function for success request response
         * @param  {Function} options.error                             Callback function for handle error in the request
         * @return {ES6 Promise}                                        Promise about the request status and response
         */
        request.send = function(options) {
            options = options || {};

            if (!options.url) {
                throw new Error('undefined:url');
            }

            var params = {
                method: options.method || request.method.GET,
                url: options.url,
                headers: typeof options.headers === 'object' ? options.headers : {},
                callbackSuccess: options.success && typeof options.success === 'function' ? options.success : undefined,
                callbackError: options.error && typeof options.error === 'function' ? options.error : undefined,
                //responseType: options.responseType === 'arraybuffer' || options.responseType === 'text' || options.responseType === 'blob' ? options.responseType : 'json',
                dataType: options.responseType === 'blob' ? options.dataType || 'image/jpg' : undefined
            };

            // default content-type
            params.headers['content-type'] = options.contentType || 'application/json';

            var dataMethods = [request.method.PUT, request.method.POST, request.method.PATCH];
            if (dataMethods.indexOf(params.method) !== -1) {
                params.data = request.serialize(options.data, params.headers['content-type']);
            }

            // add responseType to the request (blob || arraybuffer || text)
            // httpReq.responseType = responseType;

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

                var data = response.response;
                if (response.response) {
                    data = request.parse(response.response, response.responseType, response.dataType);
                }

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
                    responseObjectType: 'response',
                    error: error
                }, resolver, params.callbackSuccess, params.callbackError);

            }.bind(this));

        };

        /**
         * Check if an url should be process as a crossdomain resource.
         * @return {Boolean}
         */
        request.isCrossDomain = function(url) {
            if (url && url.indexOf('http') !== -1) {
                return true;
            } else {
                return false;
            }
        };

        var browserAjax = function(params, resolver) {

            var httpReq = new XMLHttpRequest();

            if (request.isCrossDomain(params.url) && params.withCredentials) {
                httpReq.withCredentials = true;
            }

            httpReq.open(params.method, params.url, true);

            /* add request headers */
            for (var header in params.headers) {
                if (params.headers.hasOwnProperty(header)) {
                    httpReq.setRequestHeader(header, params.headers[header]);
                }
            }

            httpReq.onload = function(xhr) {
                xhr = xhr.target || xhr; // only for mock testing purpose

                processResponse.call(this, {
                    responseObject: xhr,
                    dataType: xhr.dataType,
                    responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
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
                    responseType: xhr.responseType || xhr.getResponseHeader('content-type'),
                    response: xhr.response || xhr.responseText,
                    status: xhr.status,
                    responseObjectType: 'xhr',
                    error: xhr.error
                }, resolver, params.callbackSuccess, params.callbackError);

            }.bind(this);

            httpReq.send(params.data);
        };

        return request;

    })();

    var BaseServices = (function() {
        /**
         * A base object to inherit from for make corbel-js requests with custom behavior.
         * @exports corbel.ServicesBase
         * @namespace
         * @memberof corbel
         */
        var BaseServices = corbel.Object.inherit({ //instance props
            constructor: function(driver) {
                this.driver = driver;
            },
            /**
             * Execute the actual ajax request.
             * Retries request with refresh token when credentials are needed.
             * Refreshes the client when a force update is detected.
             * Returns a server error (403 - unsupported_version) when force update max retries are reached
             *
             * @param  {Promise} dfd     The deferred object to resolve when the ajax request is completed.
             * @param  {Object} args    The request arguments.
             */
            request: function(args) {

                var params = this._buildParams(args);
                return corbel.request.send(params).then(function(response) {

                    // this.driver.session.add(corbel.Services._FORCE_UPDATE_STATUS, 0);

                    return Promise.resolve(response);

                }).catch(function(response) {

                    // Force update
                    if (response.status === 403 &&
                        response.textStatus === corbel.Services._FORCE_UPDATE_TEXT) {

                        var retries = 0; //this.driver.session.get(corbel.Services._FORCE_UPDATE_STATUS) || 0;
                        if (retries < corbel.Services._FORCE_UPDATE_MAX_RETRIES) {
                            retries++;
                            // this.driver.session.add(corbel.Services._FORCE_UPDATE_STATUS, retries);

                            corbel.utils.reload(); //TODO nodejs
                        } else {

                            // Send an error to the caller
                            return Promise.reject(response);
                        }
                    } else {
                        // Any other error fail to the caller
                        return Promise.reject(response);
                    }

                }.bind(this));
            },
            /**
             * Returns a valid corbel.request parameters with default values,
             * CORS detection and authorization params if needed.
             * By default, all request are json (dataType/contentType)
             * with object serialization support
             * @param  {Object} args
             * @return {Object}
             */
            _buildParams: function(args) {

                // Default values
                args = args || {};

                args.dataType = args.dataType || 'json';
                args.contentType = args.contentType || 'application/json; charset=utf-8';
                args.dataFilter = args.dataFilter || corbel.Services.addEmptyJson;

                // Construct url with query string
                var url = args.url;

                if (!url) {
                    throw new Error('You must define an url');
                }

                if (args.query) {
                    url += '?' + args.query;
                }

                var headers = args.headers || {};

                // @todo: support to oauth token and custom handlers
                args.accessToken = args.accessToken || this.driver.config.get('iamToken', {}).accessToken;

                // Use access access token if exists
                if (args.accessToken) {
                    headers.Authorization = 'Bearer ' + args.accessToken;
                }
                if (args.noRedirect) {
                    headers['No-Redirect'] = true;
                }

                headers.Accept = 'application/json';
                if (args.Accept) {
                    headers.Accept = args.Accept;
                    args.dataType = undefined; // Accept & dataType are incompatibles
                }

                var params = {
                    url: url,
                    dataType: args.dataType,
                    contentType: args.contentType,
                    method: args.method || corbel.request.method.GET,
                    headers: headers,
                    data: (args.contentType.indexOf('json') !== -1 && typeof args.data === 'object' ? JSON.stringify(args.data) : args.data),
                    dataFilter: args.dataFilter
                };

                // For binary requests like 'blob' or 'arraybuffer', set correct dataType
                params.dataType = args.binaryType || params.dataType;

                // Prevent JQuery to proceess 'blob' || 'arraybuffer' data
                // if ((params.dataType === 'blob' || params.dataType === 'arraybuffer') && (params.method === 'PUT' || params.method === 'POST')) {
                //     params.processData = false;
                // }

                // console.log('services._buildParams (params)', params);
                // if (args.data) {
                //      console.log('services._buildParams (data)', args.data);
                // }

                return params;
            }
        });

        return BaseServices;

    })();
    (function(BaseServices) {

        /**
         * A module to make iam requests.
         * @exports Services
         * @namespace
         * @memberof corbel
         */
        corbel.Services = BaseServices.inherit({}, { //Static props
            _FORCE_UPDATE_TEXT: 'unsupported_version',
            _FORCE_UPDATE_MAX_RETRIES: 3,
            _FORCE_UPDATE_STATUS: 'fu_r',
            create: function(driver) {
                return new corbel.Services(driver);
            },
            /**
             * Extract a id from the location header of a requestXHR
             * @param  {Promise} res response from a requestXHR
             * @return {String}  id from the Location
             */
            getLocationId: function(responseObject) {
                var location;

                if (responseObject.xhr) {
                    location = arguments[0].xhr.getResponseHeader('location');
                } else if (responseObject.response.headers.location) {
                    location = responseObject.response.headers.location;
                }
                return location ? location.substr(location.lastIndexOf('/') + 1) : undefined;
            },
            addEmptyJson: function(response, type) {
                if (!response && type === 'json') {
                    response = '{}';
                }
                return response;
            },
            BaseServices: BaseServices
        });


        return corbel.Services;

    })(BaseServices);
    /* jshint camelcase:false */
    (function() {

        var jwt = corbel.jwt = {

            EXPIRATION: 3500,
            ALGORITHM: 'HS256',
            TYP: 'JWT',
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
                claims = claims || {};
                alg = alg || jwt.ALGORITHM;

                claims.exp = claims.exp || jwt._generateExp();

                if (!claims.iss) {
                    throw new Error('jwt:undefined:iss');
                }
                if (!claims.aud) {
                    throw new Error('jwt:undefined:aud');
                }
                if (!claims.scope) {
                    throw new Error('jwt:undefined:scope');
                }

                // Ensure claims specific order
                var claimsKeys = [
                    'iss',
                    'aud',
                    'exp',
                    'scope',
                    'prn',
                    'version',
                    'refresh_token',
                    'request_domain',

                    'basic_auth.username',
                    'basic_auth.password',

                    'device_id'
                ];

                var finalClaims = {};
                claimsKeys.forEach(function(key) {
                    if (claims[key]) {
                        finalClaims[key] = claims[key];
                    }
                });

                corbel.utils.extend(finalClaims, claims);

                if (Array.isArray(finalClaims.scope)) {
                    finalClaims.scope = finalClaims.scope.join(' ');
                }

                var bAlg = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify({
                        typ: jwt.TYP,
                        alg: alg
                    }))),
                    bClaims = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify(finalClaims))),
                    segment = bAlg + '.' + bClaims,
                    assertion = corbel.cryptography.b64tob64u(corbel.cryptography.b64_hmac_sha256(secret, segment));

                return segment + '.' + assertion;
            },

            _generateExp: function() {
                return Math.round((new Date().getTime() / 1000)) + jwt.EXPIRATION;
            },

            decode: function(assertion) {
                var serialize;
                if (!root.atob) {
                    // node environment
                    serialize = require('atob');
                } else {
                    serialize = root.atob;
                }
                var decoded = assertion.split('.');
                return [JSON.parse(serialize(decoded[0])), JSON.parse(serialize(decoded[1]))];
            }

        };

        return jwt;

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

        Iam.moduleName = 'iam';

        Iam.create = function(driver) {
            return new Iam(driver);
        };

        Iam.GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
        Iam.AUD = 'http://iam.bqws.io';
        Iam.IAM_TOKEN = 'iamToken';

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

            var urlBase = this.driver.config.get('iamEndpoint', null) ?
                this.driver.config.get('iamEndpoint') :
                this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, Iam.moduleName);

            return urlBase + uri;
        };

    })();

    (function() {

        /**
         * Creates a ClientBuilder for client managing requests.
         *
         * @param {String} domainId Domain id (optional).
         * @param {String} clientId Client id (optional).
         *
         * @return {corbel.Iam.ClientBuilder}
         */
        corbel.Iam.prototype.client = function(domainId, clientId) {
            var client = new ClientBuilder(domainId, clientId);
            client.driver = this.driver;
            return client;
        };

        /**
         * A builder for client management requests.
         *
         * @param {String} domainId Domain id.
         * @param {String} clientId Client id.
         *
         * @class
         * @memberOf iam
         */
        var ClientBuilder = corbel.Iam.ClientBuilder = corbel.Services.BaseServices.inherit({

            constructor: function(domainId, clientId) {
                this.domainId = domainId;
                this.clientId = clientId;
                this.uri = 'domain';
            },

            /**
             * Adds a new client.
             *
             * @method
             * @memberOf corbel.Iam.ClientBuilder
             *
             * @param {Object} client                          The client data.
             * @param {String} client.id                       Client id.
             * @param {String} client.name                     Client domain (obligatory).
             * @param {String} client.key                      Client key (obligatory).
             * @param {String} client.version                  Client version.
             * @param {String} client.signatureAlghorithm      Signature alghorithm.
             * @param {Object} client.scopes                   Scopes of the client.
             * @param {String} client.clientSideAuthentication Option for client side authentication.
             * @param {String} client.resetUrl                 Reset password url.
             * @param {String} client.resetNotificationId      Reset password notification id.
             *
             * @return {Promise} A promise with the id of the created client or fails
             *                   with a {@link corbelError}.
             */
            create: function(client) {
                console.log('iamInterface.domain.create', client);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId + '/client'),
                    method: corbel.request.method.POST,
                    data: client,
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Gets a client.
             *
             * @method
             * @memberOf corbel.Iam.ClientBuilder
             *
             * @param {String} clientId Client id.
             *
             * @return {Promise} A promise with the client or fails with a {@link corbelError}.
             */
            get: function() {
                console.log('iamInterface.domain.get', this.clientId);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
                    method: corbel.request.method.GET
                });
            },

            /**
             * Updates a client.
             *
             * @method
             * @memberOf corbel.Iam.ClientBuilder
             *
             * @param {Object} client                          The client data.
             * @param {String} client.name                     Client domain (obligatory).
             * @param {String} client.key                      Client key (obligatory).
             * @param {String} client.version                  Client version.
             * @param {String} client.signatureAlghorithm      Signature alghorithm.
             * @param {Object} client.scopes                   Scopes of the client.
             * @param {String} client.clientSideAuthentication Option for client side authentication.
             * @param {String} client.resetUrl                 Reset password url.
             * @param {String} client.resetNotificationId      Reset password notification id.
             *
             * @return {Promise} A promise or fails with a {@link corbelError}.
             */
            update: function(client) {
                console.log('iamInterface.domain.update', client);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
                    method: corbel.request.method.PUT,
                    data: client
                });
            },

            /**
             * Removes a client.
             *
             * @method
             * @memberOf corbel.Iam.ClientBuilder
             *
             * @param {String} clientId The client id.
             *
             * @return {Promise} A promise or fails with a {@link corbelError}.
             */
            remove: function() {
                console.log('iamInterface.domain.remove', this.domainId, this.clientId);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId + '/client/' + this.clientId),
                    method: corbel.request.method.DELETE
                });
            },

            _buildUri: corbel.Iam._buildUri

        });

    })();
    (function() {


        /**
         * Creates a DomainBuilder for domain managing requests.
         *
         * @param {String} domainId Domain id.
         *
         * @return {corbel.Iam.DomainBuilder}
         */
        corbel.Iam.prototype.domain = function(domainId) {
            var domain = new DomainBuilder(domainId);
            domain.driver = this.driver;
            return domain;
        };

        /**
         * A builder for domain management requests.
         *
         * @param {String} domainId Domain id (optional).
         *
         * @class
         * @memberOf iam
         */
        var DomainBuilder = corbel.Iam.DomainBuilder = corbel.Services.BaseServices.inherit({

            constructor: function(domainId) {
                this.domainId = domainId;
                this.uri = 'domain';
            },

            _buildUri: corbel.Iam._buildUri,

            /**
             * Creates a new domain.
             *
             * @method
             * @memberOf corbel.Iam.DomainBuilder
             *
             * @param {Object} domain                    The domain data.
             * @param {String} domain.description        Description of the domain.
             * @param {String} domain.authUrl            Authentication url.
             * @param {String} domain.allowedDomains     Allowed domains.
             * @param {String} domain.scopes             Scopes of the domain.
             * @param {String} domain.defaultScopes      Default copes of the domain.
             * @param {Object} domain.authConfigurations Authentication configuration.
             * @param {Object} domain.userProfileFields  User profile fields.
             *
             * @return {Promise} A promise with the id of the created domain or fails
             *                   with a {@link corbelError}.
             */
            create: function(domain) {
                console.log('iamInterface.domain.create', domain);
                return this.request({
                    url: this._buildUri(this.uri),
                    method: corbel.request.method.POST,
                    data: domain
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Gets a domain.
             *
             * @method
             * @memberOf corbel.Iam.DomainBuilder
             *
             * @return {Promise} A promise with the domain or fails with a {@link corbelError}.
             */
            get: function() {
                console.log('iamInterface.domain.get', this.domainId);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId),
                    method: corbel.request.method.GET
                });
            },

            /**
             * Updates a domain.
             *
             * @method
             * @memberOf corbel.Iam.DomainBuilder
             *
             * @param {Object} domain                    The domain data.
             * @param {String} domain.description        Description of the domain.
             * @param {String} domain.authUrl            Authentication url.
             * @param {String} domain.allowedDomains     Allowed domains.
             * @param {String} domain.scopes             Scopes of the domain.
             * @param {String} domain.defaultScopes      Default copes of the domain.
             * @param {Object} domain.authConfigurations Authentication configuration.
             * @param {Object} domain.userProfileFields  User profile fields.
             *
             * @return {Promise} A promise or fails with a {@link corbelError}.
             */
            update: function(domain) {
                console.log('iamInterface.domain.update', domain);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId),
                    method: corbel.request.method.PUT,
                    data: domain
                });
            },

            /**
             * Removes a domain.
             *
             * @method
             * @memberOf corbel.Iam.DomainBuilder
             *
             * @param {String} domainId The domain id.
             *
             * @return {Promise} A promise or fails with a {@link corbelError}.
             */
            remove: function() {
                console.log('iamInterface.domain.remove', this.domainId);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.domainId),
                    method: corbel.request.method.DELETE
                });
            }
        });

    })();
    (function() {

        /**
         * Creates a ScopeBuilder for scope managing requests.
         * @param {String} id Scope id.
         * @return {corbel.Iam.ScopeBuilder}
         */
        corbel.Iam.prototype.scope = function(id) {
            var scope = new ScopeBuilder(id);
            scope.driver = this.driver;
            return scope;
        };

        /**
         * A builder for scope management requests.
         *
         * @param {String} id Scope id.
         *
         * @class
         * @memberOf iam
         */
        var ScopeBuilder = corbel.Iam.ScopeBuilder = corbel.Services.BaseServices.inherit({

            constructor: function(id) {
                this.id = id;
                this.uri = 'scope';
            },

            _buildUri: corbel.Iam._buildUri,

            /**
             * Creates a new scope.
             *
             * @method
             * @memberOf corbel.Iam.ScopeBuilder
             *
             * @param {Object} scope        The scope.
             * @param {Object} scope.rules  Scope rules.
             * @param {String} scope.type   Scope type.
             * @param {Object} scope.scopes Scopes for a composite scope.
             *
             * @return {Promise} A promise with the id of the created scope or fails
             *                   with a {@link corbelError}.
             */
            create: function(scope) {
                console.log('iamInterface.scope.create', scope);
                return this.request({
                    url: this._buildUri(this.uri),
                    method: corbel.request.method.POST,
                    data: scope
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Gets a scope.
             *
             * @method
             * @memberOf corbel.Iam.ScopeBuilder
             *
             * @return {Promise} A promise with the scope or fails with a {@link corbelError}.
             */
            get: function() {
                console.log('iamInterface.scope.get', this.id);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.id),
                    method: corbel.request.method.GET
                });
            },

            /**
             * Removes a scope.
             *
             * @method
             * @memberOf corbel.Iam.ScopeBuilder
             * @return {Promise} A promise user or fails with a {@link corbelError}.
             */
            remove: function() {
                console.log('iamInterface.scope.remove', this.id);
                return this.request({
                    url: this._buildUri(this.uri + '/' + this.id),
                    method: corbel.request.method.DELETE
                });
            }

        });

    })();
    (function() {

        /**
         * Creates a TokenBuilder for token requests
         * @return {corbel.Iam.TokenBuilder}
         */
        corbel.Iam.prototype.token = function() {
            var tokenBuilder = new TokenBuilder(this.driver);
            tokenBuilder.driver = this.driver;
            return tokenBuilder;
        };

        /**
         * A builder for token requests
         * @class
         * @memberOf Iam
         */
        var TokenBuilder = corbel.Iam.TokenBuilder = corbel.Services.BaseServices.inherit({

            constructor: function() {
                this.uri = 'oauth/token';
            },

            _buildUri: corbel.Iam._buildUri,

            /**
             * Build a JWT with default driver config
             * @param  {Object} params
             * @param  {String} [params.secret]
             * @param  {Object} [params.claims]
             * @param  {String} [params.claims.iss]
             * @param  {String} [params.claims.aud]
             * @param  {String} [params.claims.scope]
             * @return {String} JWT assertion
             */
            _getJwt: function(params) {
                params = params || {};
                params.claims = params.claims || {};

                if (params.jwt) {
                    return params.jwt;
                }

                var secret = params.secret || this.driver.config.get('clientSecret');
                params.claims.iss = params.claims.iss || this.driver.config.get('clientId');
                params.claims.aud = params.claims.aud || corbel.Iam.AUD;
                params.claims.scope = params.claims.scope || this.driver.config.get('scopes');
                return corbel.jwt.generate(params.claims, secret);
            },

            _doGetTokenRequest: function(uri, params, setCookie) {
                var args = {
                    url: this._buildUri(uri),
                    method: corbel.request.method.GET,
                    query: corbel.utils.param(corbel.utils.extend({
                        assertion: this._getJwt(params),
                        'grant_type': corbel.Iam.GRANT_TYPE
                    }, params.oauth))
                };

                if (setCookie) {
                    args.headers = {
                        RequestCookie: 'true'
                    };
                }

                return corbel.request.send(args);
            },

            _doPostTokenRequest: function(uri, params, setCookie) {
                var args = {
                    url: this._buildUri(uri),
                    method: corbel.request.method.POST,
                    data: {
                        assertion: this._getJwt(params),
                        'grant_type': corbel.Iam.GRANT_TYPE
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                };

                if (setCookie) {
                    args.headers = {
                        RequestCookie: 'true'
                    };
                }
                return corbel.request.send(args);
            },

            /**
             * Creates a token to connect with iam
             * @method
             * @memberOf corbel.Iam.TokenBuilder
             * @param  {Object} params          Parameters to authorice
             * @param {String} [params.jwt]     Assertion to generate the token
             * @param {Object} [params.claims]  Claims to generate the token
             * @param {Boolean} [setCookie]     Sends 'RequestCookie' to server
             * @return {Promise}                Q promise that resolves to an AccessToken {Object} or rejects with a {@link corbelError}
             */
            create: function(params, setCookie) {
                params = params || {};
                // if there are oauth params this mean we should do use the GET verb
                var promise;
                if (params.oauth) {
                    promise = this._doGetTokenRequest(this.uri, params, setCookie);
                }
                // otherwise we use the traditional POST verb.
                promise = this._doPostTokenRequest(this.uri, params, setCookie);

                var that = this;
                return promise.then(function(response) {
                    that.driver.config.set(corbel.Iam.IAM_TOKEN, response.data);
                    return response;
                });
            },

            /**
             * Refresh a token to connect with iam
             * @method
             * @memberOf corbel.Iam.TokenBuilder
             * @param {String} [refresh_token]   Token to refresh an AccessToken
             * @param {String} [scopes]          Scopes to the AccessToken
             * @return {Promise}                 Q promise that resolves to an AccesToken {Object} or rejects with a {@link corbelError}
             */
            refresh: function(refreshToken, scopes) {
                // console.log('iamInterface.token.refresh', refreshToken);
                // we need refresh token to refresh access token
                corbel.validate.isValue(refreshToken, 'Refresh access token request must contains refresh token');
                // we need create default claims to refresh access token
                var params = {
                    claims: {
                        'scope': scopes,
                        'refresh_token': refreshToken
                    }
                };
                // we use the traditional POST verb to refresh access token.
                return this._doPostTokenRequest(this.uri, params);
            }

        });

    })();
    (function() {

        /**
         * Starts a username request
         * @return {corbel.Iam.UsernameBuilder}    The builder to create the request
         */
        corbel.Iam.prototype.username = function() {
            var username = new UsernameBuilder();
            username.driver = this.driver;
            return username;
        };

        /**
         * Builder for creating requests of users name
         * @class
         * @memberOf iam
         */
        var UsernameBuilder = corbel.Iam.UsernameBuilder = corbel.Services.BaseServices.inherit({

            constructor: function() {
                this.uri = 'username';
            },

            _buildUri: corbel.Iam._buildUri,

            /**
             * Return availability endpoint.
             * @method
             * @memberOf corbel.Iam.UsernameBuilder
             * @param  {String} username The username.
             * @return {Promise}     A promise which resolves into usename availability boolean state.
             */
            availability: function(username) {
                console.log('iamInterface.username.availability', username);
                return this.request({
                    url: this._buildUri(this.uri, username),
                    method: corbel.request.method.HEAD
                }).then(function() {
                    return false;
                }).catch(function(response) {
                    if (response.status === 404) {
                        return true;
                    } else {
                        return Promise.reject(response);
                    }
                });
            }
        });

    })();
    (function() {

        /**
         * Starts a user request
         * @param  {String} [id=undefined|id|'me'] Id of the user to perform the request
         * @return {corbel.Iam.UserBuilder|corbel.Iam.UsersBuilder}    The builder to create the request
         */
        corbel.Iam.prototype.user = function(id) {
            var builder;
            if (id) {
                builder = new UserBuilder(id);
            } else {
                builder = new UsersBuilder();
            }

            builder.driver = this.driver;
            return builder;
        };

        /**
         * getUser mixin for UserBuilder & UsersBuilder
         * @param  {String=GET|POST|PUT} method
         * @param  {String} uri
         * @param  {String} id
         * @param  {Bolean} postfix
         * @return {Promise}
         */
        corbel.Iam._getUser = function(method, uri, id, postfix) {
            return this.request({
                url: (postfix ? this._buildUri(uri, id) + postfix : this._buildUri(uri, id)),
                method: corbel.request.method.GET
            });
        };

        /**
         * Builder for a specific user requests
         * @class
         * @memberOf iam
         * @param {String} id The id of the user
         */
        var UserBuilder = corbel.Iam.UserBuilder = corbel.Services.BaseServices.inherit({

            constructor: function(id) {
                this.uri = 'user';
                this.id = id;
            },

            _buildUri: corbel.Iam._buildUri,
            _getUser: corbel.Iam._getUser,

            /**
             * Gets the user
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise}  Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
             */
            get: function() {
                console.log('iamInterface.user.get');
                return this._getUser(corbel.request.method.GET, this.uri, this.id);
            },

            /**
             * Updates the user
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @param  {Object} data    The data to update
             * @return {Promise}        Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
             */
            update: function(data) {
                console.log('iamInterface.user.update', data);
                return this.request({
                    url: this._buildUri(this.uri, this.id),
                    method: corbel.request.method.PUT,
                    data: data
                });
            },

            /**
             * Deletes the user
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
             */
            delete: function() {
                console.log('iamInterface.user.delete');
                return this.request({
                    url: this._buildUri(this.uri, this.id),
                    method: corbel.request.method.DELETE
                });
            },

            /**
             * Sign Out the logged user.
             * @example
             * iam().user('me').signOut();
             * @method
             * @memberOf corbel.Iam.UsersBuilder
             * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
             */
            signOut: function() {
                console.log('iamInterface.users.signOutMe');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/signout',
                    method: corbel.request.method.PUT
                });
            },

            /**
             * disconnect the user, all his tokens are deleted
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
             */
            disconnect: function() {
                console.log('iamInterface.user.disconnect');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/disconnect',
                    method: corbel.request.method.PUT
                });
            },

            /**
             * Adds an identity (link to an oauth server or social network) to the user
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @param {Object} identity     The data of the identity
             * @param {String} oauthId      The oauth ID of the user
             * @param {String} oauthService The oauth service to connect (facebook, twitter, google, corbel)
             * @return {Promise}  Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
             */
            addIdentity: function(identity) {
                // console.log('iamInterface.user.addIdentity', identity);
                corbel.validate.isValue(identity, 'Missing identity');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/identity',
                    method: corbel.request.method.POST,
                    data: identity
                });
            },

            /**
             * Get user identities (links to oauth servers or social networks)
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise}  Q promise that resolves to {Array} of Identity or rejects with a {@link corbelError}
             */
            getIdentities: function() {
                console.log('iamInterface.user.getIdentities');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/identity',
                    method: corbel.request.method.GET
                });
            },

            /**
             * User device register
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @param  {Object} data      The device data
             * @param  {Object} data.URI  The device token
             * @param  {Object} data.name The device name
             * @param  {Object} data.type The device type (Android, Apple)
             * @return {Promise} Q promise that resolves to a User {Object} or rejects with a {@link corbelError}
             */
            registerDevice: function(data) {
                console.log('iamInterface.user.registerDevice');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/devices',
                    method: corbel.request.method.PUT,
                    data: data
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Get device
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @param  {String}  deviceId    The device id
             * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
             */
            getDevice: function(deviceId) {
                console.log('iamInterface.user.getDevice');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                    method: corbel.request.method.GET
                });
            },

            /**
             * Get all user devices
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
             */
            getDevices: function() {
                console.log('iamInterface.user.getDevices');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/devices/',
                    method: corbel.request.method.GET
                });
            },

            /**
             * Delete user device
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @param  {String}  deviceId    The device id
             * @return {Promise} Q promise that resolves to a Device {Object} or rejects with a {@link corbelError}
             */
            deleteDevice: function(deviceId) {
                console.log('iamInterface.user.deleteDevice');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/devices/' + deviceId,
                    method: corbel.request.method.DELETE
                });
            },

            /**
             * Get user profiles
             * @method
             * @memberOf corbel.Iam.UserBuilder
             * @return {Promise}  Q promise that resolves to a User Profile or rejects with a {@link corbelError}
             */
            getProfile: function() {
                console.log('iamInterface.user.getProfile');
                return this.request({
                    url: this._buildUri(this.uri, this.id) + '/profile',
                    method: corbel.request.method.GET
                });
            }

        });


        /**
         * Builder for creating requests of users collection
         * @class
         * @memberOf iam
         */
        var UsersBuilder = corbel.Iam.UsersBuilder = corbel.Services.BaseServices.inherit({

            constructor: function() {
                this.uri = 'user';
            },

            _buildUri: corbel.Iam._buildUri,

            /**
             * Sends a reset password email to the email address recived.
             * @method
             * @memberOf oauth.UsersBuilder
             * @param  {String} userEmailToReset The email to send the message
             * @return {Promise}                 Q promise that resolves to undefined (void) or rejects with a {@link corbelError}
             */
            sendResetPasswordEmail: function(userEmailToReset) {
                console.log('iamInterface.users.sendResetPasswordEmail', userEmailToReset);
                var query = 'email=' + userEmailToReset;
                return this.request({
                    url: this._buildUri(this.uri + '/resetPassword'),
                    method: corbel.request.method.GET,
                    query: query
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Creates a new user.
             * @method
             * @memberOf corbel.Iam.UsersBuilder
             * @param  {Object} data The user data.
             * @return {Promise}     A promise which resolves into the ID of the created user or fails with a {@link corbelError}.
             */
            create: function(data) {
                console.log('iamInterface.users.create', data);
                return this.request({
                    url: this._buildUri(this.uri),
                    method: corbel.request.method.POST,
                    data: data
                }).then(function(res) {
                    res.data = corbel.Services.getLocationId(res);
                    return res;
                });
            },

            /**
             * Gets all users of the current domain
             * @method
             * @memberOf corbel.Iam.UsersBuilder
             * @return {Promise} Q promise that resolves to an {Array} of Users or rejects with a {@link corbelError}
             */
            get: function(params) {
                console.log('iamInterface.users.get', params);
                return this.request({
                    url: this._buildUri(this.uri),
                    method: corbel.request.method.GET,
                    query: params ? corbel.utils.serializeParams(params) : null
                });
            },

            getProfiles: function(params) {
                console.log('iamInterface.users.getProfiles', params);
                return this.request({
                    url: this._buildUri(this.uri) + '/profile',
                    method: corbel.request.method.GET,
                    query: params ? corbel.utils.serializeParams(params) : null //TODO cambiar por util e implementar dicho metodo
                });
            }

        });

    })();
    var aggregationBuilder = (function() {

        var aggregationBuilder = {};

        /**
         * Adds a count operation to aggregation
         * @param  {String} field Name of the field to aggregate or * to aggregate all
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        aggregationBuilder.count = function(field) {
            this.params.aggregation = this.params.aggregation || {};
            this.params.aggregation.$count = field;
            return this;
        };

        return aggregationBuilder;

    })();
    var queryBuilder = (function() {

        var queryBuilder = {};

        /**
         * Adds an Equal criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.eq = function(field, value) {
            this.addCriteria('$eq', field, value);
            return this;
        };

        /**
         * Adds a Greater Than criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.gt = function(field, value) {
            this.addCriteria('$gt', field, value);
            return this;
        };

        /**
         * Adds a Greater Than Or Equal criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.gte = function(field, value) {
            this.addCriteria('$gte', field, value);
            return this;
        };

        /**
         * Adds a Less Than criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.lt = function(field, value) {
            this.addCriteria('$lt', field, value);
            return this;
        };

        /**
         * Adds a Less Than Or Equal criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.lte = function(field, value) {
            this.addCriteria('$lte', field, value);
            return this;
        };

        /**
         * Adds a Not Equal criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.ne = function(field, value) {
            this.addCriteria('$ne', field, value);
            return this;
        };

        /**
         * Adds a Like criteria to query
         * @param  {String} field
         * @param  {String | Number | Date} value
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.like = function(field, value) {
            this.addCriteria('$like', field, value);
            return this;
        };

        /**
         * Adds an In criteria to query
         * @param  {String} field
         * @param  {String[]|Number[]|Date[]} values
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.in = function(field, values) {
            this.addCriteria('$in', field, values);
            return this;
        };

        /**
         * Adds an All criteria to query
         * @param  {String} field
         * @param  {String[]|Number[]|Date[]} values
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.all = function(field, values) {
            this.addCriteria('$all', field, values);
            return this;
        };

        /**
         * Adds an Element Match criteria to query
         * @param  {String} field
         * @param  {JSON} value Query for the matching
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        queryBuilder.elemMatch = function(field, query) {
            this.addCriteria('$elem_match', field, query);
            return this;
        };

        /**
         * Sets an specific queryDomain, by default 'api'.
         * @param {String} queryDomain query domain name, 'api' and '7digital' supported
         */
        queryBuilder.setQueryDomain = function(queryDomain) {
            this.params.queryDomain = queryDomain;
            return this;
        };

        queryBuilder.addCriteria = function(operator, field, value) {
            var criteria = {};
            criteria[operator] = {};
            criteria[operator][field] = value;
            this.params.query = this.params.query || [];
            this.params.query.push(criteria);
            return this;
        };

        return queryBuilder;

    })();
    var pageBuilder = (function() {

        var pageBuilder = {};

        /**
         * Sets the page number of the page param
         * @param  {int} page
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        pageBuilder.page = function(page) {
            this.params.pagination = this.params.pagination || {};
            this.params.pagination.page = page;
            return this;
        };

        /**
         * Sets the page size of the page param
         * @param  {int} size
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        pageBuilder.pageSize = function(size) {
            this.params.pagination = this.params.pagination || {};
            this.params.pagination.size = size;
            return this;
        };

        /**
         * Sets the page number and page size of the page param
         * @param  {int} size
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        pageBuilder.pageParam = function(page, size) {
            this.params.pagination = this.params.pagination || {};
            this.params.pagination.page = page;
            this.params.pagination.size = size;
            return this;
        };

        return pageBuilder;


    })();
    var sortBuilder = (function() {

        var sortBuilder = {};

        /**
         * Sets ascending direction to sort param
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        sortBuilder.asc = function(field) {
            this.params.sort = this.params.sort || {};
            this.params.sort[field] = corbel.Resources.sort.ASC;
            return this;
        };

        /**
         * Sets descending direction to sort param
         * @return {RequestParamsBuilder} RequestParamsBuilder
         */
        sortBuilder.desc = function(field) {
            this.params.sort = this.params.sort || {};
            this.params.sort[field] = corbel.Resources.sort.DESC;
            return this;
        };

        return sortBuilder;
    })();
    (function(aggregationBuilder, queryBuilder, sortBuilder, pageBuilder) {



        /**
         * A module to build Request Params
         * @exports requestParamsBuilder
         * @namespace
         * @memberof app.silkroad
         */
        corbel.requestParamsBuilder = corbel.Object.inherit({
            constructor: function() {
                this.params = {};
            },
            /**
             * Returns the JSON representation of the params
             * @return {JSON} representation of the params
             */
            build: function() {
                return this.params;
            }
        });


        corbel.utils.extend(corbel.requestParamsBuilder.prototype, queryBuilder, sortBuilder, aggregationBuilder, pageBuilder);

        return corbel.requestParamsBuilder;

    })(aggregationBuilder, queryBuilder, sortBuilder, pageBuilder);
    (function() {
        corbel.Resources = corbel.Object.inherit({

            constructor: function(driver) {
                this.driver = driver;
            },

            collection: function(type) {
                return new corbel.Resources.Collection(type, this.driver);
            },

            resource: function(type, id) {
                return new corbel.Resources.Resource(type, id, this.driver);
            },

            relation: function(srcType, srcId, destType) {
                return new corbel.Resources.Relation(srcType, srcId, destType, this.driver);
            }

        }, {

            moduleName: 'resources',

            sort: {

                /**
                 * Ascending sort
                 * @type {String}
                 * @constant
                 * @default
                 */
                ASC: 'asc',

                /**
                 * Descending sort
                 * @type {String}
                 * @constant
                 * @default
                 */
                DESC: 'desc'

            },

            /**
             * constant for use to specify all resources wildcard
             * @namespace
             */
            ALL: '_',

            create: function(driver) {
                return new corbel.Resources(driver);
            }

        });

        return corbel.Resources;

    })();
    (function() {
        corbel.Resources.BaseResource = corbel.Services.BaseServices.inherit({

            /**
             * Helper function to build the request uri
             * @param  {String} srcType     Type of the resource
             * @param  {String} srcId       Id of the resource
             * @param  {String} relType     Type of the relationed resource
             * @param  {String} destId      Information of the relationed resource
             * @return {String}             Uri to perform the request
             */
            buildUri: function(srcType, srcId, destType, destId) {

                var urlBase = this.driver.config.get('resourcesEndpoint', null) ?
                    this.driver.config.get('resourcesEndpoint') :
                    this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Resources.moduleName);

                var uri = urlBase + 'resource/' + srcType;

                if (srcId) {
                    uri += '/' + srcId;
                    if (destType) {
                        uri += '/' + destType;
                        if (destId) {
                            uri += ';r=' + destType + '/' + destId;
                        }
                    }
                }

                return uri;
            },

            request: function(args) {
                var params = corbel.utils.extend(this.params, args);

                this.params = {}; //reset instance params

                args.query = corbel.utils.serializeParams(params);

                return corbel.Services.prototype.request.apply(this, [args].concat(Array.prototype.slice.call(arguments, 1))); //call service request implementation
            },

            getURL: function(params) {
                return this.buildUri(this.type, this.srcId, this.destType) + (params ? '?' + corbel.utils.serializeParams(params) : '');
            },

            getDefaultOptions: function(options) {
                options = options || {};

                return options;
            }

        });

        corbel.utils.extend(corbel.Resources.BaseResource.prototype, corbel.requestParamsBuilder.prototype); // extend for inherit requestParamsBuilder methods extensible for all Resources object

        return corbel.Resources.BaseResource;

    })();
    (function() {
        /**
         * Relation
         * @class
         * @memberOf Resources
         * @param  {String} srcType     The source resource type
         * @param  {String} srcId       The source resource id
         * @param  {String} destType    The destination resource type
         */
        corbel.Resources.Relation = corbel.Resources.BaseResource.inherit({

            constructor: function(srcType, srcId, destType, driver, params) {
                this.type = srcType;
                this.srcId = srcId;
                this.destType = destType;
                this.driver = driver;
                this.params = params || {};
            },

            /**
             * Gets the resources of a relation
             * @method
             * @memberOf Resources.Relation
             * @param  {String} dataType    Mime type of the expected resource
             * @param  {String} destId         Relationed resource
             * @param  {Object} params      Params of the silkroad request
             * @return {Promise}            ES6 promise that resolves to a relation {Object} or rejects with a {@link SilkRoadError}
             * @see {@link corbel.util.serializeParams} to see a example of the params
             */
            get: function(destId, options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.srcId, this.destType, destId),
                    method: corbel.request.method.GET,
                    Accept: options.dataType
                });

                return this.request(args);
            },

            /**
             * Adds a new relation between Resources
             * @method
             * @memberOf Resources.Relation
             * @param  {String} destId          Relationed resource
             * @param  {Object} relationData Additional data to be added to the relation (in json)
             * @return {Promise}             ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
             * @example uri = '555'
             */
            add: function(destId, relationData, options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.srcId, this.destType, destId),
                    contentType: 'application/json',
                    data: relationData,
                    method: corbel.request.method.POST
                });

                return this.request(args);
            },

            /**
             * Move a relation
             * @method
             * @memberOf Resources.Relation
             * @param  {Integer} pos          The new position
             * @return {Promise}              ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
             */
            move: function(destId, pos, options) {

                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.srcId, this.destType, destId),
                    contentType: 'application/json',
                    data: {
                        '_order': '$pos(' + pos + ')'
                    },
                    method: corbel.request.method.PUT
                });

                return this.request(args);
            },

            /**
             * Deletes a relation between Resources
             * @method
             * @memberOf Resources.Relation
             * @param  {String} destId          Relationed resource
             * @return {Promise}                ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
             * @example
             * destId = 'music:Track/555'
             */
            delete: function(destId, options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.srcId, this.destType, destId),
                    method: corbel.request.method.DELETE
                });

                return this.request(args);
            }

        });

        return corbel.Resources.Relation;

    })();
    (function() {

        /**
         * Collection requests
         * @class
         * @memberOf Resources
         * @param {String} type The collection type
         * @param {CorbelDriver} corbel instance
         */
        corbel.Resources.Collection = corbel.Resources.BaseResource.inherit({

            constructor: function(type, driver, params) {
                this.type = type;
                this.driver = driver;
                this.params = params || {};
            },

            /**
             * Gets a collection of elements, filtered, paginated or sorted
             * @method
             * @memberOf Resources.CollectionBuilder
             * @param  {Object} options             Get options for the request
             * @return {Promise}                    ES6 promise that resolves to an {Array} of Resources or rejects with a {@link SilkRoadError}
             * @see {@link corbel.util.serializeParams} to see a example of the params
             */
            get: function(options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type),
                    method: corbel.request.method.GET,
                    Accept: options.dataType
                });

                return this.request(args);
            },

            /**
             * Adds a new element to a collection
             * @method
             * @memberOf Resources.CollectionBuilder
             * @param  {[Object]} data      Data array added to the collection
             * @param  {Object} options     Options object with dataType request option
             * @return {Promise}            ES6 promise that resolves to the new resource id or rejects with a {@link SilkRoadError}
             */
            add: function(data, options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type),
                    method: corbel.request.method.PUT,
                    contentType: options.dataType,
                    Accept: options.dataType,
                    data: data
                });

                return this.request(args).then(function(res) {
                    return corbel.Services.getLocationId(res);
                });
            }

        });

        return corbel.Resources.Collection;

    })();
    (function() {
        /**
         * Builder for resource requests
         * @class
         * @memberOf resources
         * @param  {String} type    The resource type
         * @param  {String} id      The resource id
         */
        corbel.Resources.Resource = corbel.Resources.BaseResource.inherit({

            constructor: function(type, id, driver, params) {
                this.type = type;
                this.id = id;
                this.driver = driver;
                this.params = params || {};
            },

            /**
             * Gets a resource
             * @method
             * @memberOf resources.Resource
             * @param  {Object} options
             * @param  {String} [options.dataType]      Mime type of the expected resource
             * @param  {Object} [options.params]        Additional request parameters
             * @return {Promise}                        ES6 promise that resolves to a Resource {Object} or rejects with a {@link SilkRoadError}
             * @see {@link services.request} to see a example of the params
             */
            get: function(options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.id),
                    method: corbel.request.method.GET,
                    contentType: options.dataType,
                    Accept: options.dataType
                });

                return this.request(args);
            },

            /**
             * Updates a resource
             * @method
             * @memberOf resources.Resource
             * @param  {Object} data                    Data to be updated
             * @param  {Object} options
             * @param  {String} [options.dataType]      Mime tipe of the sent data
             * @param  {Object} [options.params]        Additional request parameters
             * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
             * @see {@link services.request} to see a example of the params
             */
            update: function(data, options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.id),
                    method: corbel.request.method.PUT,
                    data: data,
                    contentType: options.dataType,
                    Accept: options.dataType
                });

                return this.request(args);
            },

            /**
             * Deletes a resource
             * @method
             * @memberOf resources.Resource
             * @param  {Object} options
             * @param  {Object} [options.dataType]      Mime tipe of the delete data
             * @return {Promise}                        ES6 promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
             */
            delete: function(options) {
                options = this.getDefaultOptions(options);

                var args = corbel.utils.extend(options, {
                    url: this.buildUri(this.type, this.id),
                    method: corbel.request.method.DELETE,
                    contentType: options.dataType,
                    Accept: options.dataType
                });

                return this.request(args);
            }

        });

        return corbel.Resources.Resource;

    })();

    return corbel;
});
