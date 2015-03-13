'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('JWT module', function() {

    var CLIENT_ID = '38c1a251';

    it('exists and is an object', function() {
        expect(corbel.jwt).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(corbel.jwt).to.include.keys(
            'generate'
        );
    });

    it.skip('generates a valid JWT', function() {
        // @todo: generate an example jwt with version claim
        var secret = '4f768d88820c997b5e25d0c6f614d1e4ab4a356c85ec1ea194712fef8427da7c',
            claims = {
                'iss': CLIENT_ID,
                'aud': 'http://iam.bqws.io',
                'exp': 1391535,
                'scope': 'resources:bookland:read_catalog'
            };

        // without alg
        var assertion = corbel.jwt.generate(claims, secret);
        expect(assertion).to.be.equal('eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIzOGMxYTI1MSIsImF1ZCI6Imh0dHA6Ly9pYW0uYnF3cy5pbyIsImV4cCI6MTM5MTUzNSwic2NvcGUiOiJyZXNvdXJjZXM6Ym9va2xhbmQ6cmVhZF9jYXRhbG9nIn0.mYpJNS6LcTzglqoLf4xw9Uv8g_wASV22bGNXEv4nwoc');

        // with alg
        assertion = corbel.jwt.generate(claims, secret, 'HS256');
        expect(assertion).to.be.equal('eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIzOGMxYTI1MSIsImF1ZCI6Imh0dHA6Ly9pYW0uYnF3cy5pbyIsImV4cCI6MTM5MTUzNSwic2NvcGUiOiJyZXNvdXJjZXM6Ym9va2xhbmQ6cmVhZF9jYXRhbG9nIn0.mYpJNS6LcTzglqoLf4xw9Uv8g_wASV22bGNXEv4nwoc');
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
