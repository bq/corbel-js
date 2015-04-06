# corbel-js


[![Stories in Ready](https://badge.waffle.io/bq/corbel-js.png?label=ready&title=Ready)](https://waffle.io/bq/corbel-js)
[![Build Status](https://api.travis-ci.org/bq/corbel-js.png?branch=master)](http://travis-ci.org/bq/corbel-js)
[![npm version](https://badge.fury.io/js/corbel-js.svg)](http://badge.fury.io/js/corbel-js)
[![Bower version](https://badge.fury.io/bo/corbel-js.svg)](http://badge.fury.io/bo/corbel-js)
[![Coverage Status](https://coveralls.io/repos/bq/corbel-js/badge.svg?branch=master)](https://coveralls.io/r/bq/corbel-js?branch=master)
[![Dependency status](https://david-dm.org/bq/corbel-js/status.png)](https://david-dm.org/bq/corbel-js#info=dependencies&view=table)
[![Dev Dependency Status](https://david-dm.org/bq/corbel-js/dev-status.png)](https://david-dm.org/bq/corbel-js#info=devDependencies&view=table)

A SDK for corbel compatible with browsers and node.

## [Homepage](http://opensource.bq.com/corbel-js/)

## Quickstart

### Instance a new driver

```javascript
var corbelDriver = corbel.getDriver(options);
```

### Driver options

```javascript
var options = {
	'clientId': 'clientId',
	'clientSecret': 'clientSecret',

	'urlBase': 'http://localhost:8080/{{module}}',
    'resourcesEndpoint',
    'iamEndpoint',
    'evciEndpoint',
    'oauthEndpoint',

	'scopesApp': 'scopesApp',
	'scopesUserLogin': 'scopesUserLogin',
	'scopesUserCreate': 'scopesUserCreate',

    'oauthClientId',
    'oauthSecret',
    'oauthService',

    'device_id'
}
```

### Get an application token

```javascript
corbelDriver.iam.token().create().then(function() {
    return corbelDriver.resources.collection(collectionName).add('application/json', params);
}).then(function(response) {
    var resourceId = response.data;
    return corbelDriver.resources.resource(collectionName, respurceId).get();
}).then(function(response) {
    console.log('resource', response.data);
}).catch(function(error) {
    console.error('some.error', error);
});
```

### Resources API

## Collections

```javascript
var collection = corbelDriver.resources.collection('books:book');

collection.get({    //options passed to the collection request method (query,dataType etc.)

}).then(function(collectionData){
});

collection.add({ // new model added to the collection

}, {    //options passed to the collection request method (query,dataType etc.)

}).then(function(idNewModel){

});
```

## Relations

```javascript
var relation = corbelDriver.resources.relation('books:book','id1','id2');

relation.get('destId',
{    //options passed to the relation request method (query,dataType etc.)

}).then(function(collectionData){
});

relation.add('destId',
{   //related data

},{ // new model added to the relation

}, {    //options passed to the relation request method (query,dataType etc.)

}).then(function(data){

});

relation.move('destId','pos',
{    //options passed to the relation request method (query,dataType etc.)

}).then(function(){

});

relation.delete('destId',
{    //options passed to the relation request method (query,dataType etc.)

}).then(function(){

});
```

## Resources

```javascript
var resource = corbelDriver.resources.resource('books:book');

resource.get('destId',
{    //options passed to the collection request method (query,dataType etc.)

}).then(function(resourceData){
});

resource.update('resource',
{   //resource update data

}, {    //options passed to the resource request method (query,dataType etc.)

}).then(function(data){

});

resource.delete('resourceId',
{    //options passed to the collection request method (query,dataType etc.)

}).then(function(){

});
```








### Manage application session

```javascript
corbelDriver.session.get('key'); //get value from local storage
corbelDriver.session.add('key', value, isPersistent); //add value to the local storage
corbelDriver.session.gatekeeper(); //return true if the session driver is active
corbelDriver.session.destroy(); //clear the current session data
corbelDriver.session.removeDir(); //in nodejs, remove the directory/files of the current session
```

### library static methods

```javascript
corbel.jwt.generate(claimsObject, secret);
corbel.request.send(params);
// ... more
```

