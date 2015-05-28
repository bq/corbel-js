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

    //  @include ../../bower_components/es6-promise/promise.js

    var corbel = {};

    corbel.__env__ = typeof window === 'undefined' && typeof module !== 'undefined' && module.exports ? 'node' : 'browser';

    //-----------Utils and libraries (exports into corbel namespace)---------------------------

    //  @include ../corbel.js

    //  @include ../utils.js

    //  @include ../validate.js

    //  @include ../object.js

    //  @include ../cryptography.js

    //  @include ../session.js

    //----------corbel modules----------------

    //  @include ../config.js
    //  @include ../request.js
    //  @include ../services/base-services.js
    //  @include ../services/services.js
    //  @include ../jwt.js
    //  @include ../iam/iam.js
    //  @include ../iam/clientBuilder.js
    //  @include ../iam/domainBuilder.js
    //  @include ../iam/scopeBuilder.js
    //  @include ../iam/tokenBuilder.js
    //  @include ../iam/usernameBuilder.js
    //  @include ../iam/usersBuilder.js
    //  @include ../assets/assets.js
    //  @include ../assets/assets-builder.js
    //  @include ../request-params/aggregation-builder.js
    //  @include ../request-params/query-builder.js
    //  @include ../request-params/page-builder.js
    //  @include ../request-params/sort-builder.js
    //  @include ../request-params/request-params-builder.js
    //  @include ../resources/resources.js
    //  @include ../resources/base-resource.js
    //  @include ../resources/relation.js
    //  @include ../resources/collection.js
    //  @include ../resources/resource.js

    return corbel;
});