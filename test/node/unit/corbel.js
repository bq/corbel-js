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

        it('urlBase is required', function() {
            expect(function() {
                corbel.getDriver();
            }).to.throw('undefined:urlBase');
        });

        it('clientId is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url'
                });
            }).to.throw('undefined:clientId');
        });

        it('clientSecret is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId'
                });
            }).to.throw('undefined:clientSecret');
        });

        it('scopesApp is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret'
                });
            }).to.throw('undefined:scopesApp');
        });

        it('scopesUserLogin is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp'
                });
            }).to.throw('undefined:scopesUserLogin');
        });

        it('scopesUserCreate is required', function() {
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


        it('resourcesEndpoint is required', function() {
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

        it('iamEndpoint is required', function() {
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

        it('evciEndpoint is required', function() {
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

        it('oauthEndpoint is required', function() {
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

        it('oauthClientId is required', function() {
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

        it('oauthSecret is required', function() {
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

        it('oauthService is required', function() {
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
                    
                    oauthClientId: 'bitbloq-client',
                    oauthSecret: 'bitbloq-secret'
                });
            }).to.throw('undefined:oauthService');
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
                    oauthSecret: 'bitbloq-secret',
                    oauthService: 'corbel'
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
                    oauthSecret: 'bitbloq-secret',
                    oauthService: 'corbel'
                });
            });

            it('has all members', function() {
                expect(corbelDriver).to.have.ownProperty('config');
                expect(corbelDriver.config).to.be.an.instanceof(corbel.Config);
                expect(corbel).to.have.ownProperty('Iam');
            });

        });

    });
});
