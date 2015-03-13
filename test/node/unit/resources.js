/* global describe, it, afterEach, beforeEach, before, after */

/*jshint newcap: false */
(function() {
    'use strict';

    var corbel = require('../../../dist/corbel.js'),
        chai = require('chai'),
        sinon = require('sinon'),
        expect = chai.expect;

    var TEST_ENDPOINT = 'http://resources-int.bqws.io/v1.0/',
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

    var common = {
        urlBase: 'url',

        clientId: 'clientId',
        clientSecret: 'clientSecret',

        scopesApp: 'scopesApp',
        scopesUserLogin: 'scopesUserLogin',
        scopesUserCreate: 'scopesUserCreate',

        resourcesEndpoint: TEST_ENDPOINT,
        iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
        evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
        oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',

        oauthClientId: 'bitbloq-client',
        oauthSecret: 'bitbloq-secret',
        oauthService: 'corbel'
    };

    describe('Silkroad Resources module', function() {

        var sandbox = sinon.sandbox.create(),
            resources;

        before(function() {
            resources = corbel.getDriver(common).resources;
        });

        after(function() {});

        beforeEach(function() {
            sandbox.stub(corbel.services, 'request').returns(
                new Promise(function(resolve) {
                    resolve();
                })
            );
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
                page: {
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
                page: {
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

            var callRequestParam = corbel.services.request.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('gets all resources in a collection with a mediaType', function() {
            resources.collection('books:Book').get(undefined, 'epub');
            var callRequestParam = corbel.services.request.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.Accept).to.be.equal('epub');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        it('get a resource with mediaType', function() {
            resources.resource('books:Book', '123').get('application/json');
            var callRequestParam = corbel.services.request.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.Accept).to.be.equal('application/json');
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

        //Sanity check SILKROAD-712
        it('get a resource with mediaType and noContent', function() {
            resources.resource('books:Book', '123').get('application/json', {
                noRedirect: true
            });
            var callRequestParam = corbel.services.request.firstCall.args[0];
            expect(callRequestParam.url).to.be.equal(TEST_ENDPOINT + 'resource/books:Book/123');
            expect(callRequestParam.method).to.be.equal('GET');
            expect(callRequestParam.Accept).to.be.equal('application/json');
            expect(callRequestParam.noRedirect).to.be.equal(true);
            expect(callRequestParam.withAuth).to.be.equal(true);
        });

    });
})();