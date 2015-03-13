/* jshint camelcase:false */
//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    corbel.jwt = {

        EXPIRATION: 3500,
        ALGORITHM: 'HS256',
        VERSION: '1.0.0',

        /**
         * JWT-HmacSHA256 generator
         * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
         * @param  {Object}                                 claims Specific claims to include in the JWT (iss, aud, exp, scope, ...)
         * @param  {String} secret                          String with the client assigned secret
         * @param  {Object} [alg='corbel.jwt.ALGORITHM']    Object with the algorithm type
         * @return {String} jwt                             JWT string
         */
        generate: function(claims, secret, alg) {
            claims = claims || {};
            alg = alg || corbel.jwt.ALGORITHM;

            claims.version = claims.version || corbel.jwt.VERSION;
            claims.exp = claims.exp || corbel.jwt._generateExp();

            if (!claims.iss) {
                throw new Error('jwt:undefined:iss');
            }
            if (!claims.aud) {
                throw new Error('jwt:undefined:aud');
            }
            if (!claims.scope) {
                throw new Error('jwt:undefined:scope');
            }

            // Ensure claims specific order
            var claimsKeys = [
                'iss',
                'aud',
                'exp',
                'scope',
                'prn',
                'version',
                'refresh_token',
                'request_domain',
                'device_id'
            ];

            var finalClaims = {};
            claimsKeys.forEach(function(key) {
                if (claims[key]) {
                    finalClaims[key] = claims[key];
                }
            });

            corbel.utils.extend(finalClaims, claims);

            var bAlg = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify({
                    alg: alg
                }))),
                bClaims = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify(finalClaims))),
                segment = bAlg + '.' + bClaims,
                assertion = corbel.cryptography.b64tob64u(corbel.cryptography.b64_hmac_sha256(secret, segment));

            return segment + '.' + assertion;
        },

        _generateExp: function() {
            return Math.round((new Date().getTime() / 1000)) + corbel.jwt.EXPIRATION;
        }

    };

    return corbel.jwt;

})();
