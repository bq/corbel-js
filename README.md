corbel-js
=========

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

### Installation

* browser

  ```bash
  bower install corbel-js --save
  # for environments without promises support
  bower install es6-promise --save
  ```

* node

  ```bash
  npm install corbel-js --save
  ```

### Instance a new driver

```javascript
var corbelDriver = corbel.getDriver(options);
```

### Driver options

```javascript
var options = {
    'clientId': 'clientId',
    'clientSecret': 'clientSecret',
    'audience': 'audience',

    'urlBase': 'http://localhost:8080/{{module}}',

    'scopes': 'scopes',

    'device_id'
}
```

### Get an application token

```javascript
corbelDriver.iam.token().create().then(function() {
    return corbelDriver.resources.collection(collectionName).add('application/json', params);
}).then(function(resourceId) {
    return corbelDriver.resources.resource(collectionName, resourceId).get();
}).then(function(response) {
    console.log('resource', response.data);
}).catch(function(error) {
    console.error('some.error', error);
});
```


### Resources

The Resources API is a flexible programming interface for retrieval of resource's representations. Using the patterns described by this API we can deploy any kind of resource in our Corbel ecosystem with minimal impact on clients and server code. 
A request can contain URL parameters which can modify the content of representation returned or its transmission to the client.
 Parameter names must be specified on using its canonical form.

*More info:
http://docs.silkroadresources.apiary.io/

https://confluence.bq.com/pages/viewpage.action?title=SilkRoad+-+Resources+API&spaceKey=SILKROAD*

**Resources API**

Resources is exposed to corbelDriver instance and It has static methods and variables inside corbel namespace:

* Statics properties and methods in **corbel.Resources**:
  * **create**: Factory **method** for instantiating a Resources object
  * **sort**: Sort **constants object**
    
    ```javascript
    corbel.Resources.sort.ASC
    corbel.Resources.sort.DESC
    ```

  * **ALL**: **Constant** for use to specify all resources wildcard
    
    ```javascript
    corbel.Resources.ALL
    ```

* Instance methods

* **collection**: Collection factory method **collection('collectionName')**

  ```javascript
  corbelDriver.resources
    .collection('collectionName')
  ```

* **resource**: Resource factory method **resource('resourceName',id)**
  
  ```javascript
  corbelDriver.resources
    .resource('resourceName',id)
  ```

* **relation**: Relation factory method **relation('sourceResourceName', sourceResourceId, 'destResourceName')**

  ```javascript
  corbelDriver.resources
    .relation('sourceResourceName', sourceResourceId, 'destResourceName')
  ```

#### Collection

A collection is a container of resources that share the same type. For instance:

*/resource/music:Album => All resources of type music:Album*

*/resource/book:Book => All resources of type book:Book*

*/resource/music:Artist => All resources of type music:Artist*

**Collection API**

* Factory method

  ```javascript
  corbelDriver.resources
    .collection('collectionName')
  ```

* **get**: Gets a collection of elements, filtered, paginated or sorted **(requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .collection('collectionName')
    .get(requestOptionsObject)
  ```

* **add**: Adds a new element to a collection **(objectData,requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .collection('collectionName')
    .add(objectData,requestOptionsObject)
    .then(function(resourceCreatedId){
      //
    });
  ```

Examples: 

```javascript
collection.add({
    //related data
    name: 'New model name',
    lastName: 'New model last name'
},{
    //request options
}).then(function(idNewModel){ });
```

**Collection request params API**


Following params can be passed both as request options object and as chainable methods:

* Pagination:

  ```
  { pagination: { page: 1, pageSize: 5 } }
  ```

* Aggregations:

  ```
  { aggregation: { $count: '*' } }
  ```

* Sort:
  
  ```
  { sort: { title: corbel.Resources.order.sort } }
  ```

* Querys:

  ```
  { query: [{$like: {} }, {$:{} } ] }
  ```

* Custom parameters:

  ```
  { customParams: {myParam: 'myValue', ... } }
  ```

Examples: 

```javascript
var collection = corbelDriver.resources
    .collection('books:book');

collection.get({
    //request options
    query: [{
    '$like': {
        'name': 'Default name'
    }
}]).then(function(collectionData){ });

collection.get({
    //request options
    dataType: 'application/json',
    pagination: {
        page: 1,
        size: 7
    },
    {
        sort: {
            title: corbel.Resources.order.sort
        }
    }
}]).then(function(collectionData){ });
```

#### Relations

**Relation API**

* Factory method

  ```javascript
  corbelDriver.resources
    .relation('resourceName', srcId, 'relationName')
  ```

* **get**: List elements of a resource's relation **(destId, requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .relation('resourceName',15,'relationName')
    .get(destId, requestOptionsObject)
  ```

* **add**: Add new relation **(destId, relationData, requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .relation('resourceName',15,'relationName')
    .add(destId, relationData, requestOptionsObject)
  ```

* **move**: Move a relation **(destId, pos, requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .relation('resourceName',15,'relatio nName')
    .move(destId, pos, requestOptionsObject)
  ```

* **delete**: Delete a relation **(destId, requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .relation('resourceName',15,'relationName')
    .delete(destId, requestOptionsObject)
  ```

Examples: 

```javascript
var relation = corbelDriver.resources
    .relation('books:book','id1','id2');

relation.get('destId', {
    //request options
}).then(function(collectionData){ });

relation.add('15658', {
    //related data
    name: 'New model name',
    lastName: 'New model last name'
}, {
    //request options
    query: [{
        $eq:{
            'name': 'Juanfran'
        }
    }]
}).then(function(data){ });

relation.move('15658','pos', {
    //request options
}).then(function(){ });

relation.delete('15658', {
    //request options
}).then(function(){ });
```


**Relation request params API**

The same request params previously listed in the collection API.

#### Resources

A resource is a single object in a collection. For instance

*/resource/music:Album/123 => The representation of a single object of type music:Album whose identifier is 123*


**Resources API**

* Factory method 

  ```javascript
  corbelDriver.resources
    .resource('resourceName', resourceId)
  ```

* **get**: Get a resource representation **(requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .resource('resourceName',resourceId)
    .get(requestOptionsObject)
  ```

* **update**: Update a resource **(resourceData, requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .resource('resourceName',resourceId)
    .update(resourceData, requestOptionsObject)
  ```

* **delete**: Delete a resource **(requestOptionsObject)**

  ```javascript
  corbelDriver.resources
    .resource('resourceName',resourceId)
    .delete(requestOptionsObject)
  ```

Examples:

```javascript
var resource = corbelDriver.resources
    .resource('books:book', 15);

resource.get({
    //request options
}).then(function(resourceData){ });

resource.update('resource', {
    //related data
    name: 'Update model name',
    lastName: 'Update model last name'
}, {
  //request options
}).then(function(data){ });

resource.delete('resourceId', {
    //request options
}).then(function(){ });
```

####Assets

Assets are dynamic groups of scopes that a user can have for a certain period of time. 

This is an example of an asset: 

```javascript
{
   _id: "0b2dff5c39934c210d80056a94eb27bc6c6d6378",
   userId: "fooid",
   name: "assettest13",
   productId: "producttest13",
   expire: ISODate("2025-01-01T00:01:00Z"),
   active: true,
   scopes: [
       "ec:purchase:user"
   ]
}
```

Imagine assets as a group of items that extend the user permissions. For example, a user buys a digital good, then an asset is created with the permission for accessing that digital book.

When you login a user, you may want to load the assets of the user (by default they are not loaded because we try to mantain each service isolated).
For doing that, you can access `corbel` assets with `corbelDriver` this way:

```javascript
var corbelDriver = corbel.getDriver({
    iamToken : {
      'accessToken' : 'USERACCESSTOKEN'
    },
    baseUrl : 'CORBELURL'
  });

//Enable the user permissions for that accessToken
corbelDriver.assets().access();
```

You can also request all the user assets if you want, for example, listing al the goods that a user has purchased:

```javascript
corbelDriver.assets().get();
```

**Assets API**

* Factory method

  ```javascript
  corbelDriver.assets()
  ```

* **get**: Get all the assets **(requestOptionsObject)**

  ```javascript
  corbelDriver.assets()
    .get(requestOptionsObject)
  ```

* **create**: Create an asset **(assetData)**

  ```javascript
  corbelDriver.assets()
    .create(assetdata)
  ```

* **delete**: Delete an asset **(assetId)**

  ```javascript
   corbelDriver.assets(assetId).delete();
  ```


### Chainable API

You can use a chainable api to set defaults parameters over any kind of resource:

Example: 

```javascript
var collection = corbelDriver.resources
    .collection('books:book');

collection
    .like('name','default name')
    .page(5)
    .pageSize(7)
    .get();
```

The parameters specified with the chainable api will be removed when a corbel-request is maden.

```javascript
var collection = corbelDriver.resources
    .collection('books:book');

collection
    .like('name','default name')
    .page(5)
    .pageSize(7)
    .get();

//Collection doesn't have the defaults chainable params

//this get request will not use any request params previously defined 
collection.get();

```

## library static methods

```javascript
corbel.jwt.generate(claimsObject, secret);
corbel.request.send(params);
corbel.Resources
// ... more
```
