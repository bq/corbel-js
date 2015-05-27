(function(root, factory) {
    'use strict';
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['es6-pomise'], function(promise) {
            promise.polyfill();
            return factory(root);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var Promise = require('es6-promise').polyfill();
        module.exports = factory(root);
    } else if (root !== undefined) {
        if (root.ES6Promise !== undefined && typeof root.ES6Promise.polyfill === 'function') {
            root.ES6Promise.polyfill();
        }
        root.corbel = factory(root);
    }

})(this, function(root) {
    'use strict';
    /* jshint unused: false */

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
    //  @include ../request-params/aggregation-builder.js
    //  @include ../request-params/query-builder.js
    //  @include ../request-params/page-builder.js
    //  @include ../request-params/sort-builder.js
    //  @include ../request-params/request-params-builder.js
    //  @include ../assets/assets.js
    //  @include ../assets/assets-builder.js
    //  @include ../resources/resources.js
    //  @include ../resources/base-resource.js
    //  @include ../resources/relation.js
    //  @include ../resources/collection.js
    //  @include ../resources/resource.js
    //  @include ../borrow/borrow.js
    //  @include ../borrow/borrowBuilder.js
    //  @include ../borrow/userBuilder.js
    //  @include ../borrow/lenderBuilder.js

    return corbel;
});