# corbel-js


[![Stories in Ready](https://badge.waffle.io/bq/corbel-js.png?label=ready&title=Ready)](https://waffle.io/bq/corbel-js)
[![Build Status](https://api.travis-ci.org/bq/corbel-js.png?branch=master)](http://travis-ci.org/bq/corbel-js)
[![npm version](https://badge.fury.io/js/corbel-js.svg)](http://badge.fury.io/js/corbel-js)
[![Bower version](https://badge.fury.io/bo/corbel-js.svg)](http://badge.fury.io/bo/corbel-js)
[![Coverage Status](https://coveralls.io/repos/bq/corbel-js/badge.png)](https://coveralls.io/r/bq/corbel-js)
[![Dependency status](https://david-dm.org/bq/corbel-js/status.png)](https://david-dm.org/bq/corbel-js#info=dependencies&view=table)
[![Dev Dependency Status](https://david-dm.org/bq/corbel-js/dev-status.png)](https://david-dm.org/bq/corbel-js#info=devDependencies&view=table)

A SDK for corbel compatible with browsers and node.

## Quickstart

### Instance a new driver

```
var corbelDriver = corbel.getDriver({
	'urlBase': 'http://localhost:8080',
	'clientId': 'clientId',
	'clientSecret': 'clientSecret',
	'scopesApp': 'scopesApp',
	'scopesUserLogin': 'scopesUserLogin',
	'scopesUserCreate': 'scopesUserCreate'
	...
});
```

### Get an application token

```
corbelDriver.iam.token().create(...);
corbelDriver.resources.resource().get(...);
```

// library static methods
```
corbel.jwt.generate(...);
corbel.request.send(...);
corbel.utils.param(...);
corbel.cryptography.b64_hmac_sha256(...);
```

