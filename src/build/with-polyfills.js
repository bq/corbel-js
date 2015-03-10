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

    //  @include ../../bower_components/es6-promise/promise.js

    var corbel = {};


    //  @include ../request.js


    return corbel;
});