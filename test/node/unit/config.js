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


        describe('get current endpoint', function() {
            it('constructs the url correctly if no local endpoint is provided', function(){
                var driver = corbel.getDriver({
                    urlBase : 'https://{{module}}-int.bqws.io/v1.0/'    
                });
                var schedulerEndpoint = 'https://scheduler-int.bqws.io/v1.0/';
                var schedulerConstructedEndpoint = driver.config.getCurrentEndpoint(corbel.Scheduler.moduleName);
                expect(schedulerConstructedEndpoint).to.equals(schedulerEndpoint);
            });

            it('constructs the url correctly with modulePort placeholder', function(){
                var driver = corbel.getDriver({
                    urlBase : 'https://{{module}}-int.bqws.io/{{modulePort}}/v1.0/'    
                });
                var schedulerPort = driver.scheduler.task()._buildPort(driver.config);
                var schedulerEndpoint = 'https://scheduler-int.bqws.io/8094/v1.0/';
                var schedulerConstructedEndpoint = driver.config.getCurrentEndpoint(corbel.Scheduler.moduleName, schedulerPort);
                expect(schedulerConstructedEndpoint).to.equals(schedulerEndpoint);
            });

            it('returns the custom endpoint if it is provided', function(){
                var schedulerEndpoint = 'http://www.schedulers.com';
                var driver = corbel.getDriver({
                    urlBase : 'https://{{module}}-int.bqws.io/{{modulePort}}/v1.0/',
                    schedulerEndpoint : schedulerEndpoint 
                });
                var schedulerPort = driver.scheduler.task()._buildPort(driver.config);
                var schedulerConstructedEndpoint = driver.config.getCurrentEndpoint(corbel.Scheduler.moduleName, schedulerPort);
                expect(schedulerConstructedEndpoint).to.equals(schedulerEndpoint);
            });

            it('works for any module', function(){
                var modules = {
                    'oauth': 'http://localhost:8084/v1.0/',
                    'resources': 'http://localhost:8080/v1.0/',
                    'iam': 'http://localhost:8082/v1.0/',
                    'evci': 'http://localhost:8086/v1.0/',
                    'ec': 'http://localhost:8088/v1.0/',
                    'assets': 'http://localhost:8092/v1.0/',
                    'notifications': 'http://localhost:8094/v1.0/',
                    'bqpon': 'http://localhost:8090/v1.0/',
                    'webfs': 'http://localhost:8096/v1.0/',
                    'scheduler': 'http://localhost:8098/v1.0/',
                    'borrow': 'http://localhost:8100/v1.0/',
                    'composr': 'http://localhost:3000/'
                };

                var driverConfig = {
                    urlBase : 'https://{{module}}-int.bqws.io/{{modulePort}}/v1.0/'
                };

                Object.keys(modules).forEach(function(moduleName){
                    driverConfig[moduleName+'Endpoint'] = modules[moduleName];
                });

                var driver = corbel.getDriver(driverConfig);

                Object.keys(modules).forEach(function(moduleName){
                    expect(driver.config.getCurrentEndpoint(moduleName)).to.equals(modules[moduleName]);
                });

            });


        });

    });



});
