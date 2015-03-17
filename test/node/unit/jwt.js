'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('JWT module', function() {

    it('exists and is an object', function() {
        expect(corbel.jwt).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(corbel.jwt).to.include.keys(
            'generate'
        );
    });

    it('generates a valid JWT', function() {
        // @todo: generate an example jwt with version claim
        var secret = 'secret',
            claims = {
                'iss': 'clientId',
                'aud': 'http://iam.bqws.io',
                'exp': 12345,
                'scope': 'scope:example'
            };

        var EXPECTED = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbGllbnRJZCIsImF1ZCI6Imh0dHA6Ly9pYW0uYnF3cy5pbyIsImV4cCI6MTIzNDUsInNjb3BlIjoic2NvcGU6ZXhhbXBsZSJ9.eYv4fd3ZUe5ToefpKgdyrXy8iR8fHy754vkOtXsWm20';

        // without alg
        var assertion = corbel.jwt.generate(claims, secret);
        expect(assertion).to.be.equal(EXPECTED);

        // with alg
        assertion = corbel.jwt.generate(claims, secret, 'HS256');
        expect(assertion).to.be.equal(EXPECTED);
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
