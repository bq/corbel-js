/* jshint newcap: false */
'use strict'
/* globals describe it before after beforeEach afterEach */

var corbel = require('../../../dist/corbel.js')
var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect

var TEST_ENDPOINT = 'https://resources-qa.bqws.io/v1.0/domain-example/'

var DEFAULT_QUERY_OBJECT_STRING = encodeURIComponent('[{"$eq":{"field3":true}},{"$eq":{"field4":true}},{"$gt":{"field5":"value"}},{"$gte":{"field5":"value"}},{"$lt":{"field5":"value"}},{"$lte":{"field5":"value"}},{"$ne":{"field5":"value"}},{"$in":{"field2":["pepe","juan"]}},{"$all":{"field5":["pepe","juan"]}},{"$like":{"field5":"value"}}]')

var DEFAULT_SIMPLE_CONDITION_OBJECT_STRING = encodeURIComponent('[{"$eq":{"test":2}}]')

var DEFAULT_MULTIPLE_CONDITION_OBJECT_STRING = encodeURIComponent('[{"$eq":{"test":2}}]') + '&api:condition=' + encodeURIComponent('[{"$eq":{"test":3}}]')

var URL_COLLECTION_DECODED = TEST_ENDPOINT + 'resource/resource:entity?api:query=' + DEFAULT_QUERY_OBJECT_STRING + '&api:search=' + encodeURIComponent('{"text":"test"}') + '&api:distinct=' + encodeURIComponent('text,field1') + '&api:sort=' + encodeURIComponent('{"field1":"asc"}') + '&api:page=1&api:pageSize=5'

var URL_SIMPLE_CONDITION_DECODED = TEST_ENDPOINT + 'resource/resource:entity?api:condition=' + DEFAULT_SIMPLE_CONDITION_OBJECT_STRING

var URL_MULTIPLE_CONDITION_DECODED = TEST_ENDPOINT + 'resource/resource:entity?api:condition=' + DEFAULT_MULTIPLE_CONDITION_OBJECT_STRING

var DEFAULT_QUERY_OBJECT = [{
  '$eq': {
    field3: true
  }
}, {
  '$eq': {
    field4: true
  }
}, {
  '$gt': {
    field5: 'value'
  }
}, {
  '$gte': {
    field5: 'value'
  }
}, {
  '$lt': {
    field5: 'value'
  }
}, {
  '$lte': {
    field5: 'value'
  }
}, {
  '$ne': {
    field5: 'value'
  }
}, {
  '$in': {
    field2: ['pepe', 'juan']
  }
}, {
  '$all': {
    field5: ['pepe', 'juan']
  }
}, {
  '$like': {
    field5: 'value'
  }
}]

var CONFIG = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  scopes: 'scopes',
  domain: 'domain-example',
  urlBase: 'https://{{module}}-qa.bqws.io/v1.0/'
}

describe('corbel resources module', function () {
  var sandbox = sinon.sandbox.create()
  var corbelDriver
  var resources
  var request

  before(function () {
    corbelDriver = corbel.getDriver(CONFIG)
    resources = corbelDriver.resources
  })

  after(function () {})

  beforeEach(function () {
    request = sandbox.stub(corbel.request, 'send').returns(Promise.resolve())
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('has all constants defined', function () {
    expect(corbel.Resources.sort.ASC).to.be.equal('asc')
    expect(corbel.Resources.sort.DESC).to.be.equal('desc')
  })

  describe('in collections', function () {
    it('has all operations', function () {
      expect(resources.collection('id')).to.respondTo('get')
      expect(resources.collection('id')).to.respondTo('add')
    })
  })

  describe('in resources', function () {
    it('has all operations', function () {
      expect(resources.resource('resource:entity', 'resource:anyId')).to.respondTo('get')
      expect(resources.resource('resource:entity', 'resource:anyId')).to.respondTo('update')
      expect(resources.resource('resource:entity', 'resource:anyId')).to.respondTo('delete')
    })
  })

  describe('in relations', function () {
    it('has all operations', function () {
      expect(resources.relation('', '', '')).to.respondTo('get')
      expect(resources.relation('', '', '')).to.respondTo('add')
    })
  })

  it('generate single condition correctly', function () {
    var params = {
      condition: [{
        '$eq': {
          test: 2
        }
      }]
    }
    expect(resources.collection('resource:entity').getURL(params)).to.be.equal(URL_SIMPLE_CONDITION_DECODED)
  })

  it('generate multi condition correctly', function () {
    var params = {
      conditions: [{
        condition: [{
          '$eq': {
            test: 2
          }
        }]
      }, {
        condition: [{
          '$eq': {
            test: 3
          }
        }]
      }]
    }
    expect(resources.collection('resource:entity').getURL(params)).to.be.equal(URL_MULTIPLE_CONDITION_DECODED)
  })

  it('request the same condition in retry request', function (done) {
    var params = {
      conditions: [{
        condition: [{
          '$eq': {
            test: 2
          }
        }]
      }, {
        condition: [{
          '$eq': {
            test: 3
          }
        }]
      }]
    }

    var tokenObject = {
      accessToken: 'accessToken',
      expiresAt: 123123,
      refreshToken: 'refreshToken'
    }
    resources.driver.config.set(corbel.Iam.IAM_TOKEN, tokenObject)
    resources.driver.config.set(corbel.Iam.IAM_TOKEN_SCOPES, 'scopes')

    request.onCall(0).returns(Promise.reject({
      status: 401
    }))
    request.onCall(1).returns(Promise.resolve({
      status: 200,
      data: tokenObject
    }))
    request.onCall(2).returns(Promise.resolve({
      status: 200
    }))

    expect(resources.collection('resource:entity').get(params)).to.be.fulfilled.then(function () {
      expect(request.callCount).to.be.equal(3)
      expect(request.getCall(0).args[0].url).to.be.equal(URL_MULTIPLE_CONDITION_DECODED)
      // call 1 is for token refresh
      expect(request.getCall(2).args[0].url).to.be.equal(URL_MULTIPLE_CONDITION_DECODED)
    }).should.notify(done)
  })

  it('generate resource query correctly', function () {
    var requestParams = {
      query: DEFAULT_QUERY_OBJECT,
      search: {
        text: 'test'
      },
      distinct: 'text,field1',
      pagination: {
        page: 1,
        pageSize: 5
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }
    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(URL_COLLECTION_DECODED)
  })

  it('generate resource query correctly', function () {
    var urlDecoded = TEST_ENDPOINT + 'resource/resource:entity?api:query=' + DEFAULT_QUERY_OBJECT_STRING +
      '&api:search=' + encodeURIComponent('{"text":"test"}') + '&api:distinct=' + encodeURIComponent('text,field1') + '&api:sort=' + encodeURIComponent('{"field1":"asc"}') + '&api:page=0&api:pageSize=0'
    var requestParams = {
      query: DEFAULT_QUERY_OBJECT,
      search: {
        text: 'test'
      },
      distinct: 'text,field1',
      pagination: {
        page: 0,
        pageSize: 0
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }
    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(urlDecoded)
  })

  it('generate resource query correctly with a string search', function () {
    var requestParams = {
      query: DEFAULT_QUERY_OBJECT,
      search: 'test',
      distinct: 'text,field1',
      pagination: {
        page: 1,
        pageSize: 5
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }

    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(URL_COLLECTION_DECODED.replace('api:search=' + encodeURIComponent('{"text":"test"}'), 'api:search=' + encodeURIComponent('test')))
  })

  it('generate resource query correctly with custom query string', function () {
    var requestParams = {
      query: 'customQueryString',
      search: {
        text: 'test'
      },
      distinct: 'text,field1',
      pagination: {
        page: 1,
        pageSize: 5
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }

    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(URL_COLLECTION_DECODED.replace(DEFAULT_QUERY_OBJECT_STRING, 'customQueryString'))
  })

  it('generates a query with weird characters', function () {
    var requestParams = {
      query: [{
        '$eq': {
          'name': 'Chewaçcá Sä+^*quñardel'
        }
      }]
    }

    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(TEST_ENDPOINT + 'resource/resource:entity?api:query=' + encodeURIComponent('[{"$eq":{"name":"Chewaçcá Sä+^*quñardel"}}]'))
  })

  it('generate resource multi query (OR)', function () {
    var requestParams = {
      queries: [{
        query: DEFAULT_QUERY_OBJECT
      }, {
        query: DEFAULT_QUERY_OBJECT
      }],
      search: {
        text: 'test'
      },
      distinct: ['text', 'field1'],
      pagination: {
        page: 1,
        pageSize: 5
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }

    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(TEST_ENDPOINT + 'resource/resource:entity?api:query=' + encodeURIComponent('[{"$eq":{"field3":true}},{"$eq":{"field4":true}},{"$gt":{"field5":"value"}},{"$gte":{"field5":"value"}},{"$lt":{"field5":"value"}},{"$lte":{"field5":"value"}},{"$ne":{"field5":"value"}},{"$in":{"field2":["pepe","juan"]}},{"$all":{"field5":["pepe","juan"]}},{"$like":{"field5":"value"}}]') + '&api:query=' + encodeURIComponent('[{"$eq":{"field3":true}},{"$eq":{"field4":true}},{"$gt":{"field5":"value"}},{"$gte":{"field5":"value"}},{"$lt":{"field5":"value"}},{"$lte":{"field5":"value"}},{"$ne":{"field5":"value"}},{"$in":{"field2":["pepe","juan"]}},{"$all":{"field5":["pepe","juan"]}},{"$like":{"field5":"value"}}]') + '&api:search=' + encodeURIComponent('{"text":"test"}') + '&api:distinct=' + encodeURIComponent('text,field1') + '&api:sort=' + encodeURIComponent('{"field1":"asc"}') + '&api:page=1&api:pageSize=5')
  })

  it('generate resource multi query (OR)', function () {
    var requestParams = {
      'queries': [{
        'query': [{
          '$like': {
            'title': 'Praga'
          }
        }, {
          '$in': {
            '_dst_id': [
              'books:Book/f44ee834b058d9f383acaece2d44613c',
              'books:Book/9979a1daf7c6eebf04375bd0fc37f3c3'
            ]
          }
        }]
      }, {
        'query': [{
          '$elem_match': {
            'authors': [{
              '$like': {
                'name': 'Praga'
              }
            }]
          }
        }, {
          '$in': {
            '_dst_id': [
              'books:Book/f44ee834b058d9f383acaece2d44613c'

            ]
          }
        }]
      }],
      search: {
        text: 'test'
      },
      distinct: ['text', 'field1'],
      pagination: {
        page: 1,
        pageSize: 5
      },
      sort: {
        field1: corbel.Resources.sort.ASC
      }
    }

    expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(TEST_ENDPOINT + 'resource/resource:entity?api:query=' + encodeURIComponent('[{"$like":{"title":"Praga"}},{"$in":{"_dst_id":["books:Book/f44ee834b058d9f383acaece2d44613c","books:Book/9979a1daf7c6eebf04375bd0fc37f3c3"]}}]') + '&api:query=' + encodeURIComponent('[{"$elem_match":{"authors":[{"$like":{"name":"Praga"}}]}},{"$in":{"_dst_id":["books:Book/f44ee834b058d9f383acaece2d44613c"]}}]') + '&api:search=' + encodeURIComponent('{"text":"test"}') + '&api:distinct=' + encodeURIComponent('text,field1') + '&api:sort=' + encodeURIComponent('{"field1":"asc"}') + '&api:page=1&api:pageSize=5')
  })

  it('resources.collection has mandatory parameters', function () {
    expect(function () {
      resources.collection()
    }).to.throw('type value is mandatory and cannot be undefined')
  })

  it('gets all resources in a collection correctly', function () {
    resources.collection('books:Book').get()

    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book')
    expect(callRequestParam.method).to.be.equal('GET')
  })

  it('gets all resources in a collection with undefined collectionId', function () {
    expect(function () {
      resources.collection().get()
    }).to.throw('type value is mandatory and cannot be undefined')
  })

  it('gets all resources in a collection with a mediaType', function () {
    resources.collection('books:Book').get({
      dataType: 'epub'
    })
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book')
    expect(callRequestParam.method).to.be.equal('GET')
    expect(callRequestParam.headers.Accept).to.be.equal('epub')
  })

  it('add model to a collection', function () {
    resources.collection('books:Book').add({
      name: 'test1',
      data: 'test-data'
    })
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book')
    expect(callRequestParam.method).to.be.equal('POST')
  })

  it('resources.resource has mandatory parameters', function () {
    expect(function () {
      resources.resource('type', undefined)
    }).to.throw('id value is mandatory and cannot be undefined')

    expect(function () {
      resources.resource(undefined, 'id')
    }).to.throw('type value is mandatory and cannot be undefined')
  })

  it('update a resource', function () {
    resources.resource('books:Book', '123').update({
      name: 'test'
    })
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123')
    expect(callRequestParam.method).to.be.equal('PUT')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
  })

  it('delete a resource', function () {
    resources.resource('books:Book', '123').delete()
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123')
    expect(callRequestParam.method).to.be.equal('DELETE')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
  })

  // Sanity check SILKROAD-712
  it('get a resource with mediaType and noContent', function () {
    resources.resource('books:Book', '123').get({
      dataType: 'application/json',
      noRedirect: true
    })
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123')
    expect(callRequestParam.method).to.be.equal('GET')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
    expect(callRequestParam.headers['No-Redirect']).to.be.equal(true)
  })

  it('update a resource acl', function () {
    resources.resource('books:Book', '123').updateAcl({
      name: 'test'
    })
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123')
    expect(callRequestParam.method).to.be.equal('PUT')
    expect(callRequestParam.headers.Accept).to.be.equal('application/corbel.acl+json')
  })

  it('resources.relation has mandatory parameters', function () {
    expect(function () {
      resources.relation()
    }).to.throw('type value is mandatory and cannot be undefined')

    expect(function () {
      resources.relation(undefined, 'srcId', 'destType')
    }).to.throw('type value is mandatory and cannot be undefined')

    expect(function () {
      resources.relation('type', undefined, 'destType')
    }).to.throw('srcId value is mandatory and cannot be undefined')

    expect(function () {
      resources.relation('type', 'srcId', undefined)
    }).to.throw('destType value is mandatory and cannot be undefined')
  })

  it('should move a relation', function () {
    resources.relation('books:Book', '123', '456').move('test', 1)
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.method).to.be.equal('PUT')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
    expect(callRequestParam.data._order).to.be.equal('$pos(1)')
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123/456;r=456/test')
  })

  it('cannot move a relation with undefined values', function () {
    expect(function () {
      resources.relation('books:Book', '123', '456').move()
    }).to.throw('destId value is mandatory and cannot be undefined')
  })

  it('should move a relation with composed Id', function () {
    resources.relation('books:Book', '123', '456').move('notImportant/test', 1)
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.method).to.be.equal('PUT')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
    expect(callRequestParam.data._order).to.be.equal('$pos(1)')
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123/456;r=456/test')
  })

  it('delete a relation', function () {
    resources.relation('books:Book', '123', '456').delete()
    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123/456')
    expect(callRequestParam.method).to.be.equal('DELETE')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
  })

  it('add a relation', function () {
    resources.relation('books:Book', '123', '456').add('457', {
      name: 'test',
      data: 'test'
    })

    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.method).to.be.equal('PUT')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
  })

  it('cannot add a relation with undefined values', function () {
    expect(function () {
      resources.relation('books:Book', '123', '456').add()
    }).to.throw('destId value is mandatory and cannot be undefined')
  })

  it('add an anonymous relation', function () {
    resources.relation('books:Book', '123', '456').addAnonymous({
      name: 'test',
      data: 'test'
    })

    var callRequestParam = corbel.request.send.firstCall.args[0]
    expect(callRequestParam.method).to.be.equal('POST')
    expect(callRequestParam.headers.Accept).to.be.equal('application/json')
  })

  it('generates the correct URL for relations', function () {
    expect(resources.relation('cars:Car', 'id123', 'cars:Store').getURL()).to.be.equal(TEST_ENDPOINT + 'resource/cars:Car/id123/cars:Store')
  })
})
