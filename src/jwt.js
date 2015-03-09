(function() {


    //@exclude
    'use strict';
    /* global corbel */
    //@endexclude

    corbel.jwt = {



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
            secret = secret || corbel.common.get('clientSecret'); //Todo
            alg = alg || corbel.common.get('jwtAlgorithm'); //Todo

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
                iss: corbel.common.get('clientId'), //TODO
                aud: corbel.common.get('claimAud'), //TODO
                scope: corbel.common.getOrDefault('claimScopes'), //TODO
                version: corbel.common.get('version') //TODO
            };

            claims.exp = Math.round((new Date().getTime() / 1000)) + corbel.common.get('claimExp');

            claims = corbel.utils.extend(claims, params);

            // console.log('jwt.createClaims.claims', claims);

            return claims;
        }
    };

    return corbel.jwt;

})();
