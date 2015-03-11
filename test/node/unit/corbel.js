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
            }).to.throw('undefined:urlBase');
        });

        it('clientSecret is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId'
                });
            }).to.throw('undefined:urlBase');
        });

        it('scopesApp is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret'
                });
            }).to.throw('undefined:urlBase');
        });

        it('scopesUserLogin is required', function() {
            expect(function() {
                corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp'
                });
            }).to.throw('undefined:urlBase');
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
            }).to.throw('undefined:urlBase');
        });

        describe('with all parametes', function() {

            it('is a CorbelBuilder instance', function() {
                expect(corbel.getDriver({
                    urlBase: 'url',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                    scopesApp: 'scopesApp',
                    scopesUserLogin: 'scopesUserLogin'
                })).to.be.an.instanceof(corbel.CorberDriver);
            });

        });



    });
});
