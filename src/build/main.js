(function(root, factory) {
    'use strict';
    /* globals module, define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['es6-pomise'], function(promise) {
            promise.polyfill();
            return factory(root);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(root);
    } else if (root !== undefined) {
        if (root.ES6Promise !== undefined && typeof root.ES6Promise.polyfill === 'function') {
            root.ES6Promise.polyfill();
        }
        root.Silkroad = factory(root);
    }

})(this, function(root) {
    'use strict';
    /* jshint unused: false */

    var Silkroad = {};


    //  @include ../request.js


    return Silkroad;
});