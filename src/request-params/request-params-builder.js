//@exclude
'use strict';
/* global corbel, aggregationBuilder, queryBuilder, sortBuilder, pageBuilder */
//@endexclude


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