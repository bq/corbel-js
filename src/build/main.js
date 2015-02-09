(function() {
    'use strict';
    /* globals module, require */
    /* jshint unused: false */

    var Silkroad = {};


    //  @include ../request.js

    if (typeof window !== 'undefined') {
        window.Silkroad = Silkroad;
    }

    return Silkroad;
})();