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

        it.skip('urlBase is required', function() {
            expect(function() {
                corbel.getDriver();
            }).to.throw('undefined:urlBase');
        });

        it.skip('clientId is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url'
                });
            }).to.throw('undefined:clientId');
        });

        it.skip('clientSecret is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId'
                });
            }).to.throw('undefined:clientSecret');
        });

        it.skip('scopesApp is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret'
                });
            }).to.throw('undefined:scopesApp');
        });

        it.skip('scopesUserLogin is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp'
                });
            }).to.throw('undefined:scopesUserLogin');
        });

        it.skip('scopesUserCreate is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin'
                });
            }).to.throw('undefined:scopesUserCreate');
        });


        it.skip('resourcesEndpoint is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate'
                });
            }).to.throw('undefined:resourcesEndpoint');
        });

        it.skip('iamEndpoint is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/'
                });
            }).to.throw('undefined:iamEndpoint');
        });

        it.skip('evciEndpoint is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/'
                });
            }).to.throw('undefined:evciEndpoint');
        });

        it.skip('oauthEndpoint is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/'
                });
            }).to.throw('undefined:oauthEndpoint');
        });

        it.skip('oauthClientId is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/'
                });
            }).to.throw('undefined:oauthClientId');
        });

        it.skip('oauthSecret is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',

                    clientId: 'clientId',
                    clientSecret: 'clientSecret',

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',

                    oauthClientId: 'bitbloq-client'
                });
            }).to.throw('undefined:oauthSecret');
        });

        describe('with all parametes', function() {

            it('it creates a CorbelDriver', function() {
                expect(corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',

                    oauthClientId: 'bitbloq-client',
                    oauthSecret: 'bitbloq-secret'
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

                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin',
                    scopesUserCreate: 'scopesUserCreate',

                    resourcesEndpoint: 'https://resources-qa.bqws.io/v1.0/',
                    iamEndpoint: 'https://iam-qa.bqws.io/v1.0/',
                    evciEndpoint: 'https://evci-qa.bqws.io/v1.0/',
                    oauthEndpoint: 'https://oauth-qa.bqws.io/v1.0/',

                    oauthClientId: 'bitbloq-client',
                    oauthSecret: 'bitbloq-secret'
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
