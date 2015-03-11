(function() {
    /* jshint camelcase:false */
    //@exclude
    'use strict';
    /* global corbel */
    //@endexclude

    corbel.jwt = {

        EXPIRATION: 3500,
        ALGORITHM: 'HS256',
        VERSION: '1.0.0',

        /**
         * JWT-HmacSHA256 generator
         * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
         * @param  {Object} claims Specific claims to include in the JWT (iss, aud, exp, scope, ...)
         * @param  {String} [secret='common.clientSecret'] String with the client assigned secret
         * @param  {Object} [alg='common.jwtAlgorithm']   Object with the algorithm type
         * @return {String} jwt JWT string
         */
        generate: function(claims, secret, alg) {
            // console.log('jwt.generate', claims, secret, alg);
            secret = secret || corbel.common.get('clientSecret');
            alg = alg || corbel.jwt.ALGORITHM;

            var bAlg = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify({
                    alg: alg
                }))),
                bClaims = corbel.cryptography.rstr2b64(corbel.cryptography.str2rstr_utf8(JSON.stringify(claims))),
                segment = bAlg + '.' + bClaims,
                assertion = corbel.cryptography.b64tob64u(corbel.cryptography.b64_hmac_sha256(secret, segment));

            return segment + '.' + assertion;
        },

        /**
         * Returns a claim with default values, that can be overriden with params values.
         * @param  {Object} params Dicctionary with claims values
         * @return {Object}        Claims Object
         */
        createClaims: function(params) {
            params = params || {};

            // Default claims values
            var claims = {
                version: params.version || corbel.jwt.VERSION,
                exp: params.exp || Math.round((new Date().getTime() / 1000)) + corbel.jwt.EXPIRATION
            };

            claims = corbel.utils.extend(claims, params);

            if (!claims.iss) {
                throw new Error('jwt:undefined:iss');
            }
            if (!claims.aud) {
                throw new Error('jwt:undefined:aud');
            }
            if (!claims.scope) {
                throw new Error('jwt:undefined:scope');
            }
            if (!claims.version) {
                throw new Error('jwt:undefined:version');
            }
            if (!claims.exp) {
                throw new Error('jwt:undefined:exp');
            }

            return claims;
        }
    };

    return corbel.jwt;

})();
