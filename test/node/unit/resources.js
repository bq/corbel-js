/* global describe, it, afterEach, beforeEach, before, after */

/*jshint newcap: false */
'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

var TEST_ENDPOINT = 'https://resources-qa.bqws.io/v1.0/',
    DEFAULT_QUERY_OBJECT_STRING = '[{"$eq":{"field3":true}},{"$eq":{"field4":true}},{"$gt":{"field5":"value"}},{"$gte":{"field5":"value"}},{"$lt":{"field5":"value"}},{"$lte":{"field5":"value"}},{"$ne":{"field5":"value"}},{"$in":{"field2":["pepe","juan"]}},{"$all":{"field5":["pepe","juan"]}},{"$like":{"field5":"value"}}]',

    URL_COLLECTION_DECODED = TEST_ENDPOINT + 'resource/resource:entity?api:query=' + DEFAULT_QUERY_OBJECT_STRING + '&api:search=test&api:sort={"field1":"asc"}&api:page=1&api:pageSize=5',


    DEFAULT_QUERY_OBJECT = [{
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
    }];

var CONFIG = {
    urlBase: 'url',

    clientId: 'clientId',
    clientSecret: 'clientSecret',

    scopes: 'scopesApp',

    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',
    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
    ecEndpoint: 'https://ec-qa.bqws.io/v1.0/',
    assetsEndpoint: 'https://assets-qa.bqws.io/v1.0/',
    notificationsEndpoint: 'https://notifications-qa.bqws.io/v1.0/',
    bqponEndpoint: 'https://bqpon-qa.bqws.io/v1.0/',
    webfsEndpoint: 'https://webfs-qa.bqws.io/v1.0/',
    schedulerEndpoint: 'https://scheduler-qa.bqws.io/v1.0/',
    borrowEndpoint: 'https://borrow-qa.bqws.io/v1.0/'
};

describe('corbel resources module', function() {

    var sandbox = sinon.sandbox.create(),
        corbelDriver,
        resources;

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

    it('has all constants defined', function() {
        expect(corbel.Resources.sort.ASC).to.be.equal('asc');
        expect(corbel.Resources.sort.DESC).to.be.equal('desc');
    });

    describe('in collections', function() {

        it('has all operations', function() {
            expect(resources.collection()).to.respondTo('get');
            expect(resources.collection()).to.respondTo('add');
        });

    });

    describe('in resources', function() {

        it('has all operations', function() {
            expect(resources.resource()).to.respondTo('get');
            expect(resources.resource()).to.respondTo('update');
            expect(resources.resource()).to.respondTo('delete');
        });

    });

    describe('in relations', function() {

        it('has all operations', function() {
            expect(resources.relation()).to.respondTo('get');
            expect(resources.relation()).to.respondTo('add');
        });

    });


    it('generate resource query correctly', function() {
        var requestParams = {
            query: DEFAULT_QUERY_OBJECT,
            search: 'test',
            pagination: {
                page: 1,
                size: 5
            },
            sort: {
                field1: corbel.Resources.sort.ASC
            }
        };

        expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(URL_COLLECTION_DECODED);
    });

    it('generate resource query correctly with custom query string', function() {
        var requestParams = {
            query: 'customQueryString',
            search: 'test',
            pagination: {
                page: 1,
                size: 5
            },
            sort: {
                field1: corbel.Resources.sort.ASC
            }
        };

        expect(resources.collection('resource:entity').getURL(requestParams)).to.be.equal(URL_COLLECTION_DECODED.replace(DEFAULT_QUERY_OBJECT_STRING, 'customQueryString'));
    });

    it('gets all resources in a collection correctly', function() {
        resources.collection('books:Book').get();

        var callRequestParam = corbel.request.send.firstCall.args[0];
        expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book');
        expect(callRequestParam.method).to.be.equal('GET');
    });

    it('gets all resources in a collection with a mediaType', function() {
        resources.collection('books:Book').get({
            dataType: 'epub'
        });
        var callRequestParam = corbel.request.send.firstCall.args[0];
        expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book');
        expect(callRequestParam.method).to.be.equal('GET');
        expect(callRequestParam.headers.Accept).to.be.equal('epub');
    });

    it('get a resource with mediaType', function() {
        resources.resource('books:Book', '123').get({
            dataType: 'application/json'
        });
        var callRequestParam = corbel.request.send.firstCall.args[0];
        expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
        expect(callRequestParam.method).to.be.equal('GET');
        expect(callRequestParam.headers.Accept).to.be.equal('application/json');
    });

    //Sanity check SILKROAD-712
    it('get a resource with mediaType and noContent', function() {
        resources.resource('books:Book', '123').get({
            dataType: 'application/json',
            noRedirect: true
        });
        var callRequestParam = corbel.request.send.firstCall.args[0];
        expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
        expect(callRequestParam.method).to.be.equal('GET');
        expect(callRequestParam.headers.Accept).to.be.equal('application/json');
        expect(callRequestParam.headers['No-Redirect']).to.be.equal(true);
    });

});