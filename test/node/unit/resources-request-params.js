/* global describe, it, afterEach, beforeEach, before, after */

/*jshint newcap: false */
'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect;

var REQUEST_PARAMS_METHODS = [
    'page',
    'pageSize',
    'pageParam',
    'asc',
    'desc',
    'count',
    'like',
    'eq',
    'gt',
    'gte',
    'lt',
    'lte',
    'ne',
    'like',
    'in',
    'all',
    'elemMatch',
    'setQueryDomain',
    'addCriteria'
];

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

describe('corbel resources request-params module', function() {

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

    it('collection has all request_params methods', function() {
        for (var i = 0; i < REQUEST_PARAMS_METHODS.length; i++) {
            expect(resources.collection('resource:entity')).respondTo(REQUEST_PARAMS_METHODS[i]);
        }
    });

    it('relation has all request_params methods', function() {
        for (var i = 0; i < REQUEST_PARAMS_METHODS.length; i++) {
            expect(resources.relation('resource:entity')).respondTo(REQUEST_PARAMS_METHODS[i]);
        }
    });

    it('resource has all request_params methods', function() {
        for (var i = 0; i < REQUEST_PARAMS_METHODS.length; i++) {
            expect(resources.resource('resource:entity')).respondTo(REQUEST_PARAMS_METHODS[i]);
        }
    });

    describe('for collections', function() {

        var collection, resource,
            serviceSpy;

        beforeEach(function() {
            collection = resources.collection('resource:entities');
            resource = resources.collection('resource:entities');
            serviceSpy = sandbox.stub(corbel.Services.prototype, '_buildParams');
        });

        it('supports aggregations', function() {
            collection.get({
                dataType: 'application/json',
                aggregation: {
                    $count: 5
                }
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                aggregation: {
                    $count: 5
                }
            }));

        });

        it('supports sort', function() {
            collection.get({
                dataType: 'application/json',
                sort: {
                    'field': corbel.Resources.sort.ASC
                }
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                sort: {
                    'field': corbel.Resources.sort.ASC
                }
            }));

        });

        it('supports querys', function() {
            collection.get({
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            }));

        });

        it('support all chain request params methods', function() {
            collection.page(1)
                .pageParam(5, 10)
                .in('name', 'test')
                .elemMatch('name', 'test')
                .ne('name', 'test')
                .lte('name', 'test')
                .lt('name', 'test')
                .gte('name', 'test')
                .all('name', 'test')
                .eq('name', 'test')
                .gt('name', 'test')
                .like('name', 'test')
                .desc('field')
                .get({
                    dataType: 'application/json'
                });
        });

        it('can chain for a request', function() {
            collection.page(1).pageSize(7).like('name', 'test').asc('field').get({
                dataType: 'application/json'
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                pagination: {
                    page: 1,
                    size: 7
                },
                query: [{
                    '$like': {
                        'name': 'test'
                    }
                }],
                sort: {
                    field: corbel.Resources.sort.ASC
                }
            }));
        });

        it('can chain an aggregation for a request', function() {
            collection.count('*').get({
                dataType: 'application/json'
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                aggregation: {
                    '$count': '*'
                }
            }));
        });

        it('can chain for a request with custom parameters on get call', function() {
            collection.page(1).pageSize(7).like('name', 'test').desc('field').get({
                dataType: 'application/json',
                pagination: {
                    page: 2,
                    size: 7
                },
                sort: {
                    field: corbel.Resources.sort.ASC
                }
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                pagination: {
                    page: 2,
                    size: 7
                },
                query: [{
                    '$like': {
                        'name': 'test'
                    }
                }],
                sort: {
                    field: corbel.Resources.sort.ASC
                }
            }));

        });

    });

    describe('for relations', function() {
        var relation,
            serviceSpy;

        beforeEach(function() {
            relation = resources.relation('resource:entities', '25', '26');
            serviceSpy = sandbox.stub(corbel.Services.prototype, '_buildParams');
        });

        it('supports aggregations', function() {
            relation.get(5, {
                aggregation: {
                    $count: 5
                }
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                aggregation: {
                    $count: 5
                }
            }));

        });

        it('supports querys', function() {
            relation.get(5, {
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            }));

        });

        it('can chain for a request', function() {
            relation.like('name', 'test').get(5, {
                dataType: 'application/json'
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    '$like': {
                        'name': 'test'
                    }
                }]
            }));

        });

        it('can chain for a request with custom parameters on get call', function() {
            relation.like('name', 'test').get(5, {
                query: [{
                    $like: {
                        name: 'otro'
                    }
                }]
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    $like: {
                        name: 'otro'
                    }
                }]
            }));

        });

    });

    describe('for resources', function() {
        var resource,
            serviceSpy;

        beforeEach(function() {
            resource = resources.resource('resource:entities', '25', '26');
            serviceSpy = sandbox.stub(corbel.Services.prototype, '_buildParams');
        });

        it('supports querys', function() {
            resource.get({
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    '$like': {
                        name: 'test-name'
                    }
                }]
            }));

        });

        it('can chain for a request', function() {
            resource.like('name', 'test').get({
                dataType: 'application/json'
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    '$like': {
                        'name': 'test'
                    }
                }]
            }));

        });

        it('can chain for a request with custom parameters on get call', function() {
            resource.like('name', 'test').get({
                query: [{
                    $like: {
                        name: 'otro'
                    }
                }]
            });

            expect(serviceSpy.firstCall.args[0].query).to.be.equal(corbel.utils.serializeParams({
                query: [{
                    $like: {
                        name: 'otro'
                    }
                }]
            }));

        });

    });

});