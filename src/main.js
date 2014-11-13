'use strict';
(function() {

    // Node
    if (typeof module !== 'undefined' && module.exports) {
        var modules = require('./modules/modules.js');

        module.exports = modules;
    }

    // Browser
    if (typeof window !== 'undefined') {
        //export variable to window object
        window.silkroad = {};
    }

}());