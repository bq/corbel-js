//@exclude
'use strict';
/* global corbel */
//@endexclude

(function() {

    var AssetsBuilder = corbel.Assets.AssetsBuilder = corbel.Services.BaseServices.inherit({

        /**
         * Creates a new AssetsBuilder
         * @param  {String} id String with the asset id or 'all' key
         * @return {Assets}
         */
        constructor: function(id) {
            this.uri = 'asset';
            this.id = id;
        },

        /**
         * Gets my user assets
         * @method
         * @memberOf assets.AssetBuilder
         * @param  {Object} [params]      Params of the silkroad request
         * @return {Promise}              Promise that resolves to a Asset {Object} or rejects with a {@link SilkRoadError}
         */
        get: function(params) {
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.GET,
                query: params ? corbel.utils.serializeParams(params) : null
            });
        },

        /**
         * Delete asset
         * @method
         * @memberOf assets.AssetBuilder
         * @return {Promise}        Promise that resolves to undefined (void) or rejects with a {@link SilkRoadError}
         */
        delete: function() {
            return this.request({
                url: this._buildUri(this.uri, this.id),
                method: corbel.request.method.DELETE
            });
        },

        /**
         * Creates a new asset
         * @method
         * @memberOf assets.AssetBuilder
         * @param {Object} data                Contains the data of the new asset
         * @param {String} userId The user id
         * @param {String} name The asset name
         * @param {Date} expire Expire date
         * @param {Boolean} active If asset is active
         * @param {Array} scopes Scopes of the asset
         * @return {Promise}                    Promise that resolves in the new asset id or rejects with a {@link SilkRoadError}
         */
        create: function(data) {
            return this.request({
                url: this._buildUri(this.uri),
                method: corbel.request.method.POST,
                data: data
            }).
            then(function(res) {
                return corbel.Services.getLocationId(res);
            });
        },

        /**
         * Generates a JWT that contains the scopes of the actual user's assets and redirects to iam to upgrade user's token
         * @method
         * @memberOf assets.AssetBuilder
         * @return {Promise} Promise that resolves to a redirection to iam/oauth/token/upgrade or rejects with a {@link SilkRoadError}
         */
        access: function(params) {
            var args = params || {};
            args.url = this._buildUri(this.uri + '/access');
            args.method = corbel.request.method.GET;
            args.noRedirect = true;

            var that = this;
            return that.request(args).then(function(uri) {
                return that.request({
                    noRetry: args.noRetry,
                    url: uri
                });
            });
        },

        _buildUri: function(path, id) {
            var uri = '',
                urlBase = this.driver.config.get('assetsEndpoint', null) ?
                this.driver.config.get('assetsEndpoint') :
                this.driver.config.get('urlBase').replace(corbel.Config.URL_BASE_PLACEHOLDER, corbel.Assets.moduleName);

            uri = urlBase + path;
            if (id) {
                uri += '/' + id;
            }
            return uri;
        }

    }, {

        moduleName: 'assets',

        create: function(driver) {
            return new corbel.AssetsBuilder(driver);
        }

    });

    return AssetsBuilder;

})();
