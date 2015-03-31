'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('in corbel module', function() {

    it('is defined and is an object', function() {
        expect(corbel).to.be.an('object');
    });

    it('expected methods are available', function() {
        expect(corbel).to.respondTo('getDriver');
    });

    it('expected static modules are available', function() {
        expect(corbel).to.have.ownProperty('jwt');
        expect(corbel).to.have.ownProperty('request');
        expect(corbel).to.have.ownProperty('utils');
        expect(corbel).to.have.ownProperty('cryptography');
    });

    describe('when generating a new driver', function() {

        describe('with all parametes', function() {

            it('it creates a CorbelDriver', function() {
                expect(corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopes: 'scopesApp',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/'
                })).to.be.an.instanceof(corbel.CorbelDriver);
            });

        });

        describe('with a CorbelDriverer instance', function() {

            var corbelDriver;

            beforeEach(function() {
                corbelDriver = corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopes: 'scopesApp',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/'
                });
            });

            it('has all members', function() {
                expect(corbelDriver).to.have.ownProperty('config');
                expect(corbelDriver.config).to.be.an.instanceof(corbel.Config);
                expect(corbelDriver.iam).to.be.an.instanceof(corbel.Iam);
                expect(corbelDriver.services).to.be.an.instanceof(corbel.Services);
                expect(corbel).to.have.ownProperty('Iam');
            });

        });

    });
});
