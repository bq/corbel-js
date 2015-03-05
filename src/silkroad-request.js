//@exclude

'use strict';
/* globals Silkroad */

//@endexclude

var SilkroadRequest = Silkroad.SilkroadRequest = {};

SilkroadRequest._TOKEN_UPGRADE_MAX_RETRIES = 1;

SilkroadRequest.authorizationDomain = {
    IAM: 'iam',
    OAUTH: 'oauth'
};

SilkroadRequest.sessionTokenName = '';

SilkroadRequest.session = {

};

/**
 * Silkroad server request. This function handles backend errors and maps them to {@link SilkRoadError}.
 *
 * @param  {Object}  args  The request argms as required by corejs/engine/services
 * @param  {Boolean} isXHR If set to true the returning promise results in a low-level object containing: data, textStatus and jqXHR. Otherwise, it resolves with just the data.
 * @return {Promise}    an {es6} promise
 */
SilkroadRequest.request = function(args, isXHR) {
    // app.log.debug('silkroadServices.request', args);

    var self = this;

    return new Promise(function(resolve, reject) {

        self.configureAuthorizationDomain(args);
        self.addTokenIfRequired(args);
        self.addRetriesIfRequired(args);

        makeRequest(args, {
            resolve: resolve,
            reject: reject
        }, isXHR);

    });
};

SilkroadRequest.requestXHR = function(args) {
    // app.log.debug('silkroadServices.requestXHR', args);

    return this.request(args, true);
};

/**
 * Extract a id from the location header of a requestXHR
 * @param  {xhr} res response from a XMLHttpRequest
 * @return {String}  id from the Location
 */
SilkroadRequest.extractLocationId = function(res) {
    var uri = res.getResponseHeader('Location');

    return uri ? uri.substr(uri.lastIndexOf('/') + 1) : undefined;
};

/**
 * Decide what kind of auth service is ....  (iam/oauth)
 * @param  {Object}  args  The request argms as required by corejs/engine/services
 */
SilkroadRequest.configureAuthorizationDomain = function(args) {
    args.authorizationDomain = args.authorizationDomain || this.authorizationDomain.IAM;

    if (args.authorizationDomain === this.authorizationDomain.IAM) {
        args.retryHook = 'token:fail';
        args.sessionTokenName = 'accessToken';
    } else if (args.authorizationDomain === this.authorizationDomain.OAUTH) {
        args.retryHook = 'token:fail:oauth:silkroad';
        args.sessionTokenName = 'silkroadOauthAccessToken';
    }
};

/**
 * Add token to the request if it's required
 * @param  {Object}  args  The request argms as required by corejs/engine/services
 */
SilkroadRequest.addTokenIfRequired = function(args) {
    if (args.withAuth) {
        args.accessToken = args.accessToken || this.session[this.sessionTokenName];
    }
};

/**
 * Add retry number to the request args if retry it's required
 * @param  {Object}  args  The request argms as required by corejs/engine/services
 */
SilkroadRequest.addRetriesIfRequired = function(args) {
    var retry = args.noRetry !== true;
    if ((args.accessToken || args.withAuth) && retry) {
        args.retries = this._TOKEN_UPGRADE_MAX_RETRIES;
    } else {
        args.retries = 0;
    }
};


var makeRequest = function(args, resolver, isXHR) {
    Silkroad.request.send(args).
    then(function(response) {
        var info;
        try {
            info = (JSON.stringify(arguments)).replace(/(\\r\\n|\\n|\\r)/gm, ' ');
        } catch (e) {}

        if (isXHR) {
            resolver.resolve.call(resolver, response);
        } else {
            if (args.noRedirect && status === 204) {
                resolver.resolve.call(resolver, response.xhr.getResponseHeader('Location'));
            } else {
                resolver.resolve.call(resolver, response.data);
            }
        }
    }).fail(function(response) {
        if (response.status === 401 && args.retries > 0) {
            args.retries = args.retries - 1;
            retriveNewTokenAndRetry(args, resolver, isXHR, response);
        } else {
            makeRequestFail(response, resolver);
        }
    });
};

var retriveNewTokenAndRetry = function(args, resolver, isXHR, originalFail) {
    var self = this;
    requestAccessToken(args.retryHook).
    then(function() {
        args.accessToken = self.session[args.sessionTokenName];
        makeRequest(args, resolver, isXHR);
    }).
    fail(function() {
        makeRequestFail(originalFail, resolver);
    });
};


var makeRequestFail = function(response, resolver) {
    app.log.debug('silkroad/services.request.fail', (JSON.stringify(response)).replace(/(\\r\\n|\\n|\\r)/gm, ' '));
    if (response.jqXHR.status) {
        resolver.reject(silkRoadError.create(response.jqXHR));
    } else {
        resolver.reject(new Error(response.textStatus + (response.errorThrown ? (':' + response.errorThrown) : '')));
    }
};

/**
 * Try to request an accessToken
 * @return {Promise}
 */
var requestAccessToken = function(retryHook) {
    app.log.debug('services.requestAccessToken');
    /**
     * Request a handler for token:fail
     * @name token:fail
     * @event
     */
    var accessTokenRequest = app.reqres.request(retryHook);
    if (accessTokenRequest) {
        return accessTokenRequest;
    } else {
        app.log.warn('No handler for ' + retryHook + ' event. Application must refresh the access token manually');
        var dfd = q.defer();
        dfd.reject('No handler for token:fail event. Application must refresh the access token manually');
        return dfd.promise;
    }
};