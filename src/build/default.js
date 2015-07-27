(function(root, factory) {
  'use strict';
  /* jshint unused: false */

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return factory(root);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory.call(root, root, process || undefined);
  } else if (root !== undefined) {
    root.corbel = factory(root);
  }

})(this, function(root, process) {
  'use strict';
  /* jshint unused: false */

  /**
   * corbel namespace
   * @exports corbel
   * @namespace
   */
  var corbel = {};

  //-----------Utils and libraries (exports into corbel namespace)---------------------------

  //  @include ../corbel.js

  //  @include ../utils.js

  //  @include ../validate.js

  //  @include ../object.js

  //  @include ../cryptography.js

  //  @include ../jwt.js

  //  @include ../request.js

  //  @include ../services.js

  //----------corbel modules----------------

  //  @include ../config.js
  //  @include ../iam/iam.js
  //  @include ../iam/clientBuilder.js
  //  @include ../iam/domainBuilder.js
  //  @include ../iam/scopeBuilder.js
  //  @include ../iam/tokenBuilder.js
  //  @include ../iam/usernameBuilder.js
  //  @include ../iam/usersBuilder.js
  //  @include ../iam/groupsBuilder.js
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
  //  @include ../oauth/oauth.js
  //  @include ../oauth/authorizationBuilder.js
  //  @include ../oauth/tokenBuilder.js
  //  @include ../oauth/userBuilder.js
  //  @include ../notifications/notifications.js
  //  @include ../notifications/notificationsBuilder.js
  //  @include ../ec/ec.js
  //  @include ../ec/productBuilder.js
  //  @include ../evci/evci.js
  //  @include ../evci/eventBuilder.js
  //  @include ../borrow/borrow.js
  //  @include ../borrow/borrowBuilder.js
  //  @include ../borrow/userBuilder.js
  //  @include ../borrow/lenderBuilder.js
  //  @include ../composr/composr.js
  //  @include ../composr/phraseBuilder.js
  //  @include ../composr/requestBuilder.js

  return corbel;
});
