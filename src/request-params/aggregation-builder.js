//@exclude
'use strict';
/* jshint unused:false */
//@endexclude


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