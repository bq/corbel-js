'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;


describe('In corbel.Config', function() {

    it('is defined and is a function', function() {
        expect(corbel.Config).to.be.a('function');
    });

    it('has all properties defined', function() {
        expect(corbel.Config).to.have.ownProperty('create');
        expect(corbel.Config).to.have.ownProperty('isNode');
        expect(corbel.Config).to.have.ownProperty('clientType');
        expect(corbel.Config).to.have.ownProperty('wwwRoot');
    });

    it('can be created with "create" method', function() {
        expect(corbel.Config.create()).to.be.an.instanceOf(corbel.Config);
    });

    describe('with a config instance', function() {

        it('has all expected methods', function() {
            var config = corbel.Config.create();
            expect(config).to.respondTo('getConfig');
            expect(config).to.respondTo('setConfig');
            expect(config).to.respondTo('get');
            expect(config).to.respondTo('set');
        });

        it('can be created with default config values', function() {
            var config = corbel.Config.create({
                key: 'value'
            });
            expect(config.get('key')).to.be.equal('value');
        });

        it('can update config values', function() {
            var config = corbel.Config.create({
                key: 'value'
            });

            config.set('key', 'newvalue');

            expect(config.get('key')).to.be.equal('newvalue');
        });

        it('can set new config values', function() {
            var config = corbel.Config.create({
                key: 'value'
            });

            config.set('key2', 'newvalue');

            expect(config.get('key')).to.be.equal('value');
            expect(config.get('key2')).to.be.equal('newvalue');
        });

        it('can set config values in bulk', function() {
            var config = corbel.Config.create({
                key: 'value'
            });

            config.setConfig({
                'key2': 'newvalue',
                'key3': 100
            });

            expect(config.get('key')).to.be.equal('value');
            expect(config.get('key2')).to.be.equal('newvalue');
            expect(config.get('key3')).to.be.equal(100);
        });

        it('can retrieve all config values', function() {
            var config = corbel.Config.create({
                key: 'value'
            });

            config.set('key2', 'newvalue');

            config = config.getConfig();

            expect(config).to.have.ownProperty('key');
            expect(config).to.have.ownProperty('key2');

            expect(config.key).to.be.equal('value');
            expect(config.key2).to.be.equal('newvalue');
        });

        describe('when getting a value', function() {

            it('throws an error if no default value is defined', function() {
                var config = corbel.Config.create({
                    key: 'value'
                });

                expect(function() {
                    config.get('key2');
                }).to.throw('config:undefined:key2');
            });

            it('returns an error if default value is defined', function() {
                var config = corbel.Config.create({
                    key: 'value'
                });

                expect(config.get('key2', 'value2')).to.be.equal('value2');
            });

        });

    });



});
