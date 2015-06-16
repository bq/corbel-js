//@exclude
'use strict';
//@endexclude

(function() {

    /**
     * Base object with
     * @class
     * @exports Object
     * @namespace
     * @memberof corbel
     */
    corbel.Object = function() {
        return this;
    };

    /**
     * Gets my user assets
     * @memberof corbel.Object
     * @see corbel.utils.inherit
     * @return {Object}
     */
    corbel.Object.inherit = corbel.utils.inherit;

    return corbel.Object;

})();