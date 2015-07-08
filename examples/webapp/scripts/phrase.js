'use strict';

(function(corbel, q) {

  var CONFIG = {
    clientId: 'a1bf75a1',
    clientSecret: '4cd0c950238652ae0e3f1029958b847a532750c64a4a36c0783f540515994de0',
    scopes: 'booqs:web booqs:user',
    urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
  };

  var corbelDriver = corbel.getDriver(CONFIG);
  var BOOK_ID = '0ece9e1e13a490d26bcf0b2df16c9f25';

  corbelDriver.iam.token().create({
    claims: {
      'basic_auth.username': 'demobooks@bq.com',
      'basic_auth.password': 'demo'
    }
  }).then(function(response) {
    return corbelDriver.resources.resource('books:Book', BOOK_ID).get();
  }).then(function(book) {
    var jwtDecoded = corbel.jwt.decode(corbelDriver.config.get('iamToken').accessToken);
    var asset = {
      userId: jwtDecoded.userId,
      name: 'Book views',
      productId: book.data.id,
      // 2025-07-08T12:36:18+02:00
      expire: 1751970978,
      active: true,
      scopes: [
        'resources:booqs:book:view;bookId=' + book.data.id
      ]
    };

    return corbelDriver.assets().create(asset);
  }).then(function(response) {
    console.log('ok', response);
  }).catch(function(err) {
    console.error('ko', err);
  });


})(window.corbel, window.Q);
