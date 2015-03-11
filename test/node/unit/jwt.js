'use strict';

var corbel = require('../../../dist/corbel.js'),
    chai = require('chai'),
    expect = chai.expect;

describe('JWT module', function() {

    var backupCFG;
    before(function() {
        backupCFG = corbel.common.getConfig();
        corbel.common.setConfig({
            clientId: '38c1a251',
            claimScopes: 'resources:bookland:read_catalog iam:user:create iam:user:delete iam:user:read'
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
        var secret = '4f768d88820c997b5e25d0c6f614d1e4ab4a356c85ec1ea194712fef8427da7c',
            claims = {
                'iss': '38c1a251',
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
