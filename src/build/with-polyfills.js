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

    //-----------Utils and libraries (exports into corbel namespace)---------------------------

    //  @include ../utils.js
    //  @include ../validate.js
    //  @include ../cryptography.js

    //----------corbel modules----------------

    //  @include ../config.js
    //  @include ../common.js
    //  @include ../request.js
    //  @include ../jwt.js
    //  @include ../services.js
    //  @include ../iam.js

    return corbel;
});