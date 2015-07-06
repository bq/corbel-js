'use strict';

(function(corbel) {

  var CONFIG = {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    scopes: 'scopes1 scopes2',
    urlBase: 'https://{{module}}-corbel.io/'
  };

  var cd = corbel.getDriver(CONFIG);

  var TEST_OBJECT = {
    test: 'test',
    test2: 'test2',
    test3: 1,
    test4: 1.3,
    test5: {
      t1: 1.3,
      t2: [1, 2, 3.3]
    }
  };
  var COLLECTION_NAME_CRUD = 'test:CoreJSObjectCrud' + Date.now();
  var resourceId;

  cd.iam.token().create().then(function(response) {
    console.log('token.response', response);

    return cd.resources.collection(COLLECTION_NAME_CRUD).add(TEST_OBJECT);
  }).then(function(response) {
    resourceId = response;
    TEST_OBJECT.test6 = true;
    TEST_OBJECT.test = 'modified';
    return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).update(TEST_OBJECT);
  }).then(function() {

    $('#test').append('<canvas id="myCanvas" width="626" height="626"></canvas>');
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();

    context.drawImage(imageObj, 0, 0);
    var blob = corbel.utils.dataURItoBlob(canvas.toDataURL());

    return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).update(blob, {
      dataType: 'blob'
    });

  }).then(function() {
    return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).delete({
      dataType: 'image/png'
    });
  }).then(function(response) {
    console.log('ok', response);
  }).catch(function(error) {
    console.log('error', error);
  });


  function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var file = evt.target.files[0];

    if (file) {
      console.log('file', file);

      cd.iam.token().create().then(function(response) {
        console.log('token.response', response);

        return cd.resources.collection(COLLECTION_NAME_CRUD).add(TEST_OBJECT);
      }).then(function(response) {
        resourceId = response;

        return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).update(file, {
          dataType: 'blob'
        });
      }).then(function() {
        return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).get({
          dataType: 'image/png',
          responseType: 'blob'
        });
      }).then(function(response) {
        var blob = response.xhr.response;
        var img = document.createElement('img');
        img.onload = function() {
          window.URL.revokeObjectURL(img.src); // Clean up after yourself.
        };
        img.src = window.URL.createObjectURL(blob);
        document.body.appendChild(img);
      }).then(function() {
        return cd.resources.resource(COLLECTION_NAME_CRUD, resourceId).delete({
          dataType: 'image/png'
        });
      });

    } else {
      console.error('Failed to load file');
    }
  }

  $('#fileinput').on('change', readSingleFile);

})(window.corbel);
