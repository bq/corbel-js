'use strict';
/* jshint camelcase:false */

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('Validate module', function() {

    it('exists and is an object', function() {
        expect(corbel.validate).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(corbel.validate).to.include.keys(
            'isDefined',
            'isNotNull',
            'isValue',
            'isGreaterThan',
            'isGreaterThanOrEqual'
        );
    });

    describe('corbel.validate.isDefined', function() {

        it('returns false when value = undefined', function() {
            expect(corbel.validate.isDefined(undefined)).to.be.equal(false);
        });

        it('can throw custom messages when return value is false', function() {
            expect(function() {
                corbel.validate.isDefined(undefined, 'message');
            }).to.throw('message');
        });

        it('returns true when value != undefined', function() {
            expect(corbel.validate.isDefined(0)).to.be.equal(true);
            expect(corbel.validate.isDefined('string')).to.be.equal(true);
            expect(corbel.validate.isDefined(NaN)).to.be.equal(true);
            expect(corbel.validate.isDefined(null)).to.be.equal(true);
            expect(corbel.validate.isDefined({})).to.be.equal(true);
            expect(corbel.validate.isDefined([])).to.be.equal(true);
        });

    });

    describe('corbel.validate.isNotNull', function() {

        it('returns false when value = null', function() {
            expect(corbel.validate.isNotNull(null)).to.be.equal(false);
        });

        it('can throw custom messages when return value is false', function() {
            expect(function() {
                corbel.validate.isNotNull(null, 'message');
            }).to.throw('message');
        });

        it('returns true when value != null', function() {
            expect(corbel.validate.isNotNull(0)).to.be.equal(true);
            expect(corbel.validate.isNotNull('string')).to.be.equal(true);
            expect(corbel.validate.isNotNull(NaN)).to.be.equal(true);
            expect(corbel.validate.isNotNull(undefined)).to.be.equal(true);
            expect(corbel.validate.isNotNull({})).to.be.equal(true);
            expect(corbel.validate.isNotNull([])).to.be.equal(true);
        });

    });

    describe('corbel.validate.isValue', function() {

        it('returns false when value = (null || undefined)', function() {
            expect(corbel.validate.isValue(null)).to.be.equal(false);
            expect(corbel.validate.isValue(undefined)).to.be.equal(false);
        });

        it('can throw custom messages when return value is false', function() {
            expect(function() {
                corbel.validate.isValue(null, 'message');
            }).to.throw('message');

            expect(function() {
                corbel.validate.isValue(undefined, 'message');
            }).to.throw('message');
        });

        it('returns true when value != (null && undefined)', function() {
            expect(corbel.validate.isValue(0)).to.be.equal(true);
            expect(corbel.validate.isValue('string')).to.be.equal(true);
            expect(corbel.validate.isValue(NaN)).to.be.equal(true);
            expect(corbel.validate.isValue({})).to.be.equal(true);
            expect(corbel.validate.isValue([])).to.be.equal(true);
        });

    });

    describe('corbel.validate.isGreaterThan', function() {

        it('works with same type', function() {
            expect(corbel.validate.isGreaterThan(0, 1)).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(0, 0)).to.be.equal(false);
            expect(corbel.validate.isGreaterThan('a', 'b')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan('a', 'a')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan('A', 'a')).to.be.equal(false);

            expect(corbel.validate.isGreaterThan(1, 0)).to.be.equal(true);
            expect(corbel.validate.isGreaterThan('b', 'a')).to.be.equal(true);
            expect(corbel.validate.isGreaterThan('a', 'A')).to.be.equal(true);

        });

        it('works with differents type', function() {
            expect(corbel.validate.isGreaterThan(0, '1')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(3, '4')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(0, '0')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(0, '0.0')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(1, '1.1')).to.be.equal(false);
            expect(corbel.validate.isGreaterThan(1, 'a')).to.be.equal(false);
            // @todo: this is pretty bizarre...
            expect(corbel.validate.isGreaterThan(555555, 'a')).to.be.equal(false);

            expect(corbel.validate.isGreaterThan(1, '0')).to.be.equal(true);
            expect(corbel.validate.isGreaterThan(4, '3')).to.be.equal(true);
            expect(corbel.validate.isGreaterThan(4, '3.4')).to.be.equal(true);
        });

        it('can throw custom messages when return value is false', function() {
            expect(function() {
                corbel.validate.isGreaterThan(0, 1, 'message');
            }).to.throw('message');
        });

    });

    describe('corbel.validate.isGreaterThanOrEqual', function() {

        it('works with same type', function() {
            expect(corbel.validate.isGreaterThanOrEqual(0, 1)).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual('a', 'b')).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual('A', 'a')).to.be.equal(false);

            expect(corbel.validate.isGreaterThanOrEqual(0, 0)).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual('a', 'a')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual(1, 0)).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual('b', 'a')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual('a', 'A')).to.be.equal(true);

        });

        it('works with differents type', function() {
            expect(corbel.validate.isGreaterThanOrEqual(0, '1')).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual(3, '4')).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual(1, '1.1')).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual(1, 'a')).to.be.equal(false);
            expect(corbel.validate.isGreaterThanOrEqual(555555, 'a')).to.be.equal(false);

            expect(corbel.validate.isGreaterThanOrEqual(0, '0')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual(0, '0.0')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual(1, '0')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual(4, '3')).to.be.equal(true);
            expect(corbel.validate.isGreaterThanOrEqual(4, '3.4')).to.be.equal(true);
        });

        it('can throw custom messages when return value is false', function() {
            expect(function() {
                corbel.validate.isGreaterThanOrEqual(0, 1, 'message');
            }).to.throw('message');
        });

    });

});
