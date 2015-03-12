'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('JWT module', function() {

    var CLIENT_ID = 'CLIENT_ID';
    var SCOPES = 'scope1 scope2';

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
                'iss': CLIENT_ID,
                'aud': 'http://iam.bqws.io',
                'exp': 1391535,
                'scope': SCOPES,
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
            iss: CLIENT_ID,
            aud: 'aud',
            scope: SCOPES
        });

        expect(claims.iss).to.be.equal(CLIENT_ID);
        expect(claims.aud).to.be.equal('aud');
        expect(claims.scope).to.be.equal(SCOPES);
        expect(claims.version).to.be.equal(corbel.jwt.VERSION);

    });

    it('can overrride default claims fields', function() {
        var claims = corbel.jwt.createClaims({
            iss: 'myiss',
            aud: 'aud',
            scope: 'scopes',
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
                    aud: 'aud'
                });
            }).to.throw('jwt:undefined:scope');

        });

        it('exp are required', function() {

            expect(function() {
                corbel.jwt.createClaims({
                    iss: 'myiss',
                    aud: 'aud',
                    scope: 'scopes',
                    exp: 0
                });
            }).to.throw('jwt:undefined:exp');

        });

    });

});
