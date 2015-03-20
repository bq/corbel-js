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

### library static methods

```javascript
corbel.jwt.generate(claimsObject, secret);
corbel.request.send(params);
// ... more
```
