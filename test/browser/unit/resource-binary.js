/*jshint newcap: false */
'use strict';

var CONFIG = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  scopes: 'scopes',

  urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
};
var TEST_ENDPOINT = CONFIG.urlBase.replace('{{module}}', 'resources');

describe('corbel resources module', function() {

  var sandbox = sinon.sandbox.create(),
    corbelDriver,
    resources;

  // crete test blob
  var canvas = document.createElement('canvas');
  canvas.id = 'myCanvas';
  canvas.width = '626';
  canvas.height = '626';

  document.getElementById('test').appendChild(canvas);
  var context = canvas.getContext('2d');
  var imageObj = new Image();

  context.drawImage(imageObj, 0, 0);
  var blob = corbel.utils.dataURItoBlob(canvas.toDataURL());
  // phantom hack
  if(canvas.remove) {
    canvas.remove();
  }

  before(function() {
    corbelDriver = corbel.getDriver(CONFIG);
    resources = corbelDriver.resources;
  });

  after(function() {});

  beforeEach(function() {
    sandbox.stub(corbel.request, 'send').returns(Promise.resolve());
  });

  afterEach(function() {
    sandbox.restore();
  });


  it('update/create a binary resource', function() {
    resources.resource('books:Book', '123').update(blob, {
      dataType: 'image/png'
    });
    var callRequestParam = corbel.request.send.firstCall.args[0];
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
    expect(callRequestParam.method).to.be.equal('PUT');
    expect(callRequestParam.headers.Accept).to.be.equal('blob');
    expect(callRequestParam.data instanceof Blob).to.be.equal(true);
  });

  it('delete a binary resource', function() {
    resources.resource('books:Book', '123').delete({
      dataType: 'image/png'
    });
    var callRequestParam = corbel.request.send.firstCall.args[0];
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
    expect(callRequestParam.method).to.be.equal('DELETE');
    expect(callRequestParam.headers.Accept).to.be.equal('image/png');
  });

  it('get a binary resource with mediaType and noContent', function() {
    resources.resource('books:Book', '123').get({
      dataType: 'image/png',
      responseType: 'blob',
      noRedirect: true
    });
    var callRequestParam = corbel.request.send.firstCall.args[0];
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
    expect(callRequestParam.method).to.be.equal('GET');
    expect(callRequestParam.headers.Accept).to.be.equal('image/png');
    expect(callRequestParam.responseType).to.be.equal('blob');
    expect(callRequestParam.headers['No-Redirect']).to.be.equal(true);
  });

});
