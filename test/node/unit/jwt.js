'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('JWT module', function() {

    var backupCFG;
    before(function() {
        backupCFG = corbel.common.getConfig();
        corbel.common.setConfig({
            clientId: 'CLIENT_ID',
            claimScopes: 'scope1 scope2'
        });
    });

    after(function() {
        corbel.common.setConfig(backupCFG);
    });

    it('exists and is an object', function() {
        expect(corbel.jwt).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(corbel.jwt).to.include.keys(
            'generate',
            'createClaims'
        );
    });

    it('generates a valid JWT', function() {
        var secret = 'secret',
            claims = {
                'iss': 'CLIENT_ID',
                'aud': 'http://iam.bqws.io',
                'exp': 1391535,
                'scope': 'scope1 scope2',
                'version': '1.0.0'
            };
        var EXPECTED_ASSERTION = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDTElFTlRfSUQiLCJhdWQiOiJodHRwOi8vaWFtLmJxd3MuaW8iLCJleHAiOjEzOTE1MzUsInNjb3BlIjoic2NvcGUxIHNjb3BlMiIsInZlcnNpb24iOiIxLjAuMCJ9.KbOL9oWU2U49klueNeMUM_HoTAh3Anw8Uk0giskTyAw';

        // without alg
        var assertion = corbel.jwt.generate(claims, secret);
        expect(assertion).to.be.equal(EXPECTED_ASSERTION);

        // with alg
        assertion = corbel.jwt.generate(claims, secret, 'HS256');
        expect(assertion).to.be.equal(EXPECTED_ASSERTION);
    });

    it('generates a default claims object', function() {
        var claims = corbel.jwt.createClaims({
            iss: corbel.common.get('clientId'),
            aud: corbel.iam.AUD,
            scope: corbel.common.get('claimScopes')
        });

        expect(claims.iss).to.be.equal(corbel.common.get('clientId'));
        expect(claims.aud).to.be.equal(corbel.iam.AUD);
        expect(claims.scope).to.be.equal(corbel.common.get('claimScopes'));
        expect(claims.version).to.be.equal(corbel.jwt.VERSION);

    });

    it('can overrride default claims fields', function() {
        var claims = corbel.jwt.createClaims({
            iss: 'myiss',
            aud: corbel.iam.AUD,
            scope: corbel.common.get('claimScopes'),
            custom: true
        });

        expect(claims.iss).to.be.equal('myiss');
        expect(claims.custom).to.be.equal(true);
    });

    describe('when creating claims', function() {

        it('iss are required', function() {

            expect(function() {
                corbel.jwt.createClaims();
            }).to.throw('jwt:undefined:iss');

        });

        it('aud are required', function() {

            expect(function() {
                corbel.jwt.createClaims({
                    iss: 'myiss'
                });
            }).to.throw('jwt:undefined:aud');

        });

        it('scope are required', function() {

            expect(function() {
                corbel.jwt.createClaims({
                    iss: 'myiss',
                    aud: corbel.iam.AUD
                });
            }).to.throw('jwt:undefined:scope');

        });

        it('exp are required', function() {

            expect(function() {
                corbel.jwt.createClaims({
                    iss: 'myiss',
                    aud: corbel.iam.AUD,
                    scope: corbel.common.get('claimScopes'),
                    exp: 0
                });
            }).to.throw('jwt:undefined:exp');

        });

    });

});
