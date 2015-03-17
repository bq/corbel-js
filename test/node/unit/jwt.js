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
            'generate'
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
        var EXPECTED_ASSERTION = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDTElFTlRfSUQiLCJhdWQiOiJodHRwOi8vaWFtLmJxd3MuaW8iLCJleHAiOjEzOTE1MzUsInNjb3BlIjoic2NvcGUxIHNjb3BlMiIsInZlcnNpb24iOiIxLjAuMCJ9._TCKYb3gbsuznfwA1gopY4mSYr7VHmvFQGxW1CJJjHQ';

        // without alg
        var assertion = corbel.jwt.generate(claims, secret);
        expect(assertion).to.be.equal(EXPECTED_ASSERTION);

        // with alg
        assertion = corbel.jwt.generate(claims, secret, 'HS256');
        expect(assertion).to.be.equal(EXPECTED_ASSERTION);
    });

    describe('when generating claims', function() {

        it('iss are required', function() {

            expect(function() {
                corbel.jwt.generate();
            }).to.throw('jwt:undefined:iss');

        });

        it('aud are required', function() {

            expect(function() {
                corbel.jwt.generate({
                    iss: 'myiss'
                });
            }).to.throw('jwt:undefined:aud');

        });

        it('scope are required', function() {

            expect(function() {
                corbel.jwt.generate({
                    iss: 'myiss',
                    aud: 'aud'
                });
            }).to.throw('jwt:undefined:scope');

        });

    });

});
