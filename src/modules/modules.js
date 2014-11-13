'use strict';
(function() {
    //nodejs
    if (typeof module !== 'undefined' && module.exports) {
        var request = require('./request/request.js');

        module.exports = {
            request: request



        };

    }

    //web browser
    if (typeof window !== 'undefined') {
        var modules = {
            request: request
        };
        return modules;
    }
})();