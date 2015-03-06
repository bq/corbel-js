(function() {


    //@exclude
    'use strict';
    /* global Silkroad */
    //@endexclude

    Silkroad.jwt = {



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
            secret = secret || Silkroad.common.get('clientSecret'); //Todo
            alg = alg || Silkroad.common.get('jwtAlgorithm'); //Todo

            var bAlg = Silkroad.cryptography.rstr2b64(Silkroad.cryptography.str2rstr_utf8(JSON.stringify({
                    alg: alg
                }))),
                bClaims = Silkroad.cryptography.rstr2b64(Silkroad.cryptography.str2rstr_utf8(JSON.stringify(claims))),
                segment = bAlg + '.' + bClaims,
                assertion = Silkroad.cryptography.b64tob64u(Silkroad.cryptography.b64_hmac_sha256(secret, segment));

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
                iss: Silkroad.common.get('clientId'), //TODO
                aud: Silkroad.common.get('claimAud'), //TODO
                scope: Silkroad.common.getOrDefault('claimScopes'), //TODO
                version: Silkroad.common.get('version') //TODO
            };

            claims.exp = Math.round((new Date().getTime() / 1000)) + Silkroad.common.get('claimExp');

            claims = Silkroad.utils.extend(claims, params);

            // console.log('jwt.createClaims.claims', claims);

            return claims;
        }
    };

    return Silkroad.jwt;

})();